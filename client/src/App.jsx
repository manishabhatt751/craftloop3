import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from './Components/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Community from './pages/community'
import Create from './pages/create'
import AIChat from './pages/AIchat'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import EditProfile from './pages/editprofile'
import HelpSupport from './pages/helpsupport'
import Notification from './pages/notification'
import Balance from './pages/balance'
import YourProject from './pages/yourproject'
import Share from './pages/share'
import SkillProfile from './pages/skillprofile'
import CourseDetails from './pages/coursedetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated Application Layout with persistent Sidebar & Topbar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/create" element={<Create />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/helpsupport" element={<HelpSupport />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/your-project" element={<YourProject />} />
          <Route path="/share" element={<Share />} />
          <Route path="/skill-profile" element={<SkillProfile />} />
          <Route path="/course-details" element={<CourseDetails />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App