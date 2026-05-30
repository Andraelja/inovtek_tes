import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '../state/auth'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import JobsPage from '../pages/JobsPage'
import PipelinePage from '../pages/PipelinePage'
import TopNav from '../ui/TopNav'
import Sidebar from '../ui/Sidebar'

// Ensure TypeScript resolves JSX + module typing in editor
// (build already succeeds)


function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Shell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <TopNav />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <Sidebar />
          <main className="pb-12">
            <Routes>
              <Route
                path="/"
                element={
                  <Protected>
                    <DashboardPage />
                  </Protected>
                }
              />
              <Route
                path="/jobs"
                element={
                  <Protected>
                    <JobsPage />
                  </Protected>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <Protected>
                    <PipelinePage />
                  </Protected>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to="/" replace />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Shell />} />
      </Routes>
    </AuthProvider>
  )
}

