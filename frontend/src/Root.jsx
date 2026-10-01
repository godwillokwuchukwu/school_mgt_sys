import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import PublicApp from './public/PublicApp'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/*" element={<Navigate to="/portal" replace />} />
        <Route path="/parent" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/parent/*" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/parents" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/parents/*" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/parent-portal" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/parent-portal/*" element={<Navigate to="/portal?role=parent" replace />} />
        <Route path="/portal/*" element={<App />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}
