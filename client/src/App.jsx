import { BrowserRouter, Routes, Route } from 'react-router-dom'

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

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

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
        <Route path="/course-details"element={<CourseDetails />}/>

        
        
        

      </Routes>
    </BrowserRouter>
  )
}

export default App