import Sidebar from '../Components/Sidebar'
import Topbar from '../Components/Topbar'
import ViewerSidebar from '../Components/viewersidebar'
import ViewerTopbar from '../Components/viewertopbar'
import ProjectDetails from './ProjectDetails'

function ProjectViewWrapper() {
  const role = localStorage.getItem('craftloopRole') || 'creator'

  if (role === 'viewer') {
    return (
      <div className="min-h-screen bg-[#faf9ff]">
        <ViewerSidebar />
        <ViewerTopbar />
        <main className="ml-64 min-h-screen pt-20">
          <div className="p-8">
            <ProjectDetails />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#21194f]">
      <Sidebar />
      <Topbar />
      <div className="pl-64 pt-20 min-h-screen p-8">
        <ProjectDetails />
      </div>
    </div>
  )
}

export default ProjectViewWrapper
