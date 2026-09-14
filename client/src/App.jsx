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
import Setting from './pages/setting'

import ViewerLayout from './Components/viewerlayout'
import ViewerHome from './pages/viewerhome'
import ViewerExplore from './pages/viewerexplore'
import ViewerCourses from './pages/viewercourse'
import ViewerCourseDetails from './pages/viewercoursedetails'
import WatchLesson from './pages/watchlesson'
import MyLearning from './pages/mylearning'
import ViewerCommunity from './pages/viewercommunity'
import ViewerMessages from './pages/viewermessages'
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/community"
            element={<Community />}
          />

          <Route
            path="/create"
            element={<Create />}
          />

          <Route
            path="/ai-chat"
            element={<AIChat />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/edit-profile"
            element={<EditProfile />}
          />

          <Route
            path="/helpsupport"
            element={<HelpSupport />}
          />

          <Route
            path="/notification"
            element={<Notification />}
          />

          <Route
            path="/balance"
            element={<Balance />}
          />

          <Route
            path="/your-project"
            element={<YourProject />}
          />

          <Route
            path="/share"
            element={<Share />}
          />

          <Route
            path="/skill-profile"
            element={<SkillProfile />}
          />

          <Route
            path="/course-details"
            element={<CourseDetails />}
          />

          <Route
            path="/setting"
            element={<Setting />}
          />

        </Route>

        <Route element={<ViewerLayout />}>

          <Route
            path="/viewerhome"
            element={<ViewerHome />}
          />

          <Route
            path="/viewerexplore"
            element={<ViewerExplore />}
          />

          <Route
            path="/viewercourse"
            element={<ViewerCourses />}
          />
          <Route
  path="/viewercoursedetails"
  element={<ViewerCourseDetails />}
/>
<Route
  path="/watchlesson"
  element={<WatchLesson />}
/>
<Route
  path="/mylearning"
  element={<MyLearning />}
/>
<Route
  path="/viewercommunity"
  element={<ViewerCommunity />}
/>
<Route
  path="/viewermessages"
  element={<ViewerMessages />}
/>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App