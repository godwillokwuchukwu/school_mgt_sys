import json
import os
import sys
import time
import urllib.error
import urllib.request

from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsAdminOrTeacher
from .models import AIAuditLog

TESTING = "pytest" in sys.modules


# Real Gemini API call with multi-model fallback cascade
CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
]


def call_gemini_api(prompt, context="", system_instruction=""):
    if TESTING:
        return f"[TEST] Response to: {prompt[:30]}"

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return (
            "[MOCK] Gemini API Key not set. Simulated response based on context: "
            + context[:50]
            + "..."
        )

    full_prompt = (
        f"Context Information:\n{context}\n\nUser Question:\n{prompt}" if context else prompt
    )
    
    body = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 1000},
    }
    if system_instruction:
        body["system_instruction"] = {"parts": [{"text": system_instruction}]}

    payload = json.dumps(body).encode("utf-8")

    last_error = None
    for model_name in CANDIDATE_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        req = urllib.request.Request(
            url, data=payload, headers={"Content-Type": "application/json"}
        )
        for attempt in range(2):
            try:
                with urllib.request.urlopen(req, timeout=12) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "").strip()
            except Exception as exc:
                last_error = exc
                time.sleep(0.5)
                continue

    return f"AI Assistant temporarily unavailable ({last_error}). Please try again shortly."


class ChatbotView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt", "").strip()
        if not prompt:
            return Response(
                {"error": "Prompt required"}, status=status.HTTP_400_BAD_REQUEST
            )

        from .knowledge_engine import build_school_context

        ctx_data = build_school_context(request.user, prompt)

        response_text = call_gemini_api(
            prompt,
            context=ctx_data["context"],
            system_instruction=ctx_data["system_instruction"],
        )

        AIAuditLog.objects.create(
            user=request.user,
            assistant_type="chatbot",
            prompt=prompt,
            response=response_text,
            context_used=ctx_data["context"][:500],
        )

        return Response({
            "response": response_text,
            "role": ctx_data["role"],
        })


class TeacherAssistantView(views.APIView):
    permission_classes = [IsAdminOrTeacher]

    def post(self, request):
        prompt = request.data.get("prompt")
        if not prompt:
            return Response(
                {"error": "Prompt required"}, status=status.HTTP_400_BAD_REQUEST
            )

        context = "Teacher Guidelines: Draft lesson plans and rubrics."
        response_text = call_gemini_api(prompt, context)

        AIAuditLog.objects.create(
            user=request.user,
            assistant_type="teacher",
            prompt=prompt,
            response=response_text,
            context_used=context,
        )

        return Response(
            {
                "response": response_text,
                "notice": "Draft generated. Human review is mandatory before publishing.",
            }
        )


class AdminAssistantView(views.APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        prompt = request.data.get("prompt")
        if not prompt:
            return Response(
                {"error": "Prompt required"}, status=status.HTTP_400_BAD_REQUEST
            )

        context = "Admin Guidelines: Controlled queries against approved datasets."
        response_text = call_gemini_api(prompt, context)

        AIAuditLog.objects.create(
            user=request.user,
            assistant_type="admin",
            prompt=prompt,
            response=response_text,
            context_used=context,
        )

        return Response({"response": response_text})


class ExplainerAssistantView(views.APIView):
    permission_classes = [IsAdminOrTeacher]

    def post(self, request):
        prompt = request.data.get("prompt")  # e.g. Student ID
        if not prompt:
            return Response(
                {"error": "Prompt required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # In reality this fetches the SHAP output from Stage 8
        context = (
            "SHAP Output: Low attendance (30% impact), Declining grades (20% impact)."
        )

        system_instruction = (
            "Summarize the factors. Do not diagnose or make disciplinary decisions."
        )
        response_text = call_gemini_api(system_instruction + " " + prompt, context)

        AIAuditLog.objects.create(
            user=request.user,
            assistant_type="explainer",
            prompt=prompt,
            response=response_text,
            context_used=context,
        )

        return Response(
            {
                "response": response_text,
                "disclaimer": "This is an AI summary of predictive factors. It is not a settled fact.",
            }
        )
