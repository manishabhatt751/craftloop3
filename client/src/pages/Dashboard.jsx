import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#faf9ff]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-64">

        {/* Top Bar */}
        <Topbar />

        {/* Dashboard Content */}
        <main className="px-8 pb-12 pt-28">

          {/* Welcome */}
          <section className="mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-purple-500">
              Welcome back
            </p>

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Good evening, Creator 👋
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Here's what's happening with your creative journey today.
                </p>
              </div>

              <button className="w-fit rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
                + Create New
              </button>
            </div>
          </section>

          {/* Temporary Content */}
          <section className="rounded-3xl border border-purple-100 bg-white p-10 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600">
                Dashboard foundation ready
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Your CraftLoop workspace
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                Your statistics, growth overview, messages, AI assistant,
                recommendations and community sections will appear here.
              </p>
            </div>
          </section>

        </main>

      </div>
    </div>
  )
}

export default Dashboard