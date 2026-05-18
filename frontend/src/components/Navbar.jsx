import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  useEffect(() => {
    let ticking = false
    let lastScrolled = window.scrollY > 18
    setScrolled(lastScrolled)

    const updateScrolled = () => {
      const nextScrolled = window.scrollY > 18
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled
        setScrolled(nextScrolled)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateScrolled)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkClass = 'rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-white/10 hover:text-[color:var(--text)]'

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'border-b border-white/10 bg-black/40 shadow-lg shadow-black/30 backdrop-blur-lg' 
        : 'bg-gradient-to-b from-black/30 to-transparent'
    }`}>
      <nav className="lux-container flex flex-wrap items-center justify-between gap-4 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display font-black text-lg sm:text-xl text-[color:var(--text)] hover:text-[#d9b56f] transition">
            LUXE SALON
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button onClick={() => scrollTo('home')} className={linkClass}>Home</button>
          <button onClick={() => scrollTo('about')} className={linkClass}>About</button>
          <button onClick={() => scrollTo('stylists')} className={linkClass}>Stylists</button>
          <button onClick={() => scrollTo('services')} className={linkClass}>Services</button>
          <button onClick={() => scrollTo('contact')} className={linkClass}>Contact Us</button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/book" className="lux-button text-xs sm:text-sm">
            <Calendar size={16} className="hidden sm:inline" /> Book Now
          </Link>
          {user && (
            <button
              onClick={() => {
                logout()
                navigate('/auth')
              }}
              className="lux-button text-xs sm:text-sm bg-white/10 text-[color:var(--text)]"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
