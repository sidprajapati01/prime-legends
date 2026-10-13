import { Outlet } from 'react-router-dom'
import TopNavbar from '../components/TopNavbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-darkBg relative">

      {/* Background grid overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* ═══ BACKGROUND WATERMARK LOGO ═══ */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] sm:opacity-[0.05]"
        style={{
          backgroundImage: 'url(/bg-logo.png)',
          backgroundSize: 'min(100vw, 1000px) auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Top Navbar */}
      <TopNavbar />

      {/* Main content */}
      <main className="flex-1 relative z-10 pt-16 sm:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}