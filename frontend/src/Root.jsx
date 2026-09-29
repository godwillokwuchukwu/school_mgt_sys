import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import PublicApp from './public/PublicApp'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/*" element={<Navigate to="/portal" replace />} />
        <Route path="/portal/*" element={<App />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}
