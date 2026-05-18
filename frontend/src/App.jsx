import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Auth from './pages/Auth'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <AuthProvider>
      <Router>
        <div className="page-shell flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
