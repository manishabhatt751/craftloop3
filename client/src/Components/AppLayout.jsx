import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './Topbar'

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#21194f]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Persistent Top Navigation Bar */}
      <TopBar />

      {/* Main Content Area offset by Sidebar (w-64 = 256px) and Topbar (h-20 = 80px) */}
      <div className="pl-64 pt-20 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
