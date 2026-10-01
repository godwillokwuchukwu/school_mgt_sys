import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import PublicApp from './public/PublicApp'
import ParentWorkspace from './ParentWorkspace'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/*" element={<Navigate to="/portal" replace />} />
        <Route path="/parent" element={<ParentWorkspace />} />
        <Route path="/parent/*" element={<ParentWorkspace />} />
        <Route path="/parents" element={<ParentWorkspace />} />
        <Route path="/parents/*" element={<ParentWorkspace />} />
        <Route path="/parent-portal" element={<ParentWorkspace />} />
        <Route path="/parent-portal/*" element={<ParentWorkspace />} />
        <Route path="/portal/*" element={<App />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}
