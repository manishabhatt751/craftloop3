import { Outlet } from 'react-router-dom'
import ViewerSidebar from './viewersidebar'
import ViewerTopbar from './viewertopbar'

function ViewerLayout() {
  return (
    <div className="min-h-screen bg-[#faf9ff]">

      {/* Viewer Sidebar */}
      <ViewerSidebar />

      {/* Viewer Topbar */}
      <ViewerTopbar />

      {/* Viewer Main Content */}
      <main className="ml-64 min-h-screen pt-20">

        <div className="p-8">
          <Outlet />
        </div>

      </main>

    </div>
  )
}

export default ViewerLayout