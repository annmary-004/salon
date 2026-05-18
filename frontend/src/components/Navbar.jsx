import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Menu, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const scrollTo = (id) => {
    setOpen(false)
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView()
  }

  const navItems = [
    ['home', 'Home'],
    ['about', 'About'],
    ['stylists', 'Stylists'],
    ['services', 'Services'],
    ['contact', 'Contact Us'],
  ]

  return (
    <header className="site-header">
      <nav className="lux-container site-nav">
        <Link to="/" onClick={() => setOpen(false)} className="site-brand">
          <span className="font-display">
            LUXE SALON
          </span>
        </Link>

        <div className="site-nav-links">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="site-nav-link">{label}</button>
          ))}
        </div>

        <div className="site-nav-actions">
          <Link to="/book" className="lux-button site-book-button">
            <Calendar size={16} /> Book Now
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

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="site-menu-button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {open && (
        <div className="site-mobile-menu">
          <div className="lux-container site-mobile-menu-inner">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="site-mobile-link"
              >
                {label}
              </button>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="lux-button site-mobile-book"
            >
              <Calendar size={16} /> Book Now
            </Link>
            {user && (
              <button
                onClick={() => {
                  setOpen(false)
                  logout()
                  navigate('/auth')
                }}
                className="rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-bold text-[color:var(--text)]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
