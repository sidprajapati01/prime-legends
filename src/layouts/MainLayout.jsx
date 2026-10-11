import { Outlet } from 'react-router-dom'
import TopNavbar from '../components/TopNavbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-darkBg">
      {/* Background grid overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* Top Navbar */}
      <TopNavbar />

      {/* Main content — page renders here */}
      <main className="flex-1 relative z-10 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}