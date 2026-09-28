import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import PublicApp from './public/PublicApp'
import StudentPortal from './student/StudentPortal'

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/*" element={<StudentPortal onLogout={() => window.location.href = '/portal'} />} />
        <Route path="/portal/*" element={<App />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}
