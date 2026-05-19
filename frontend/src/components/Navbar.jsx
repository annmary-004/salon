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
    <header className="relative z-50 border-b border-white/10 bg-black/90">
      <nav className="lux-container flex min-h-[72px] md:min-h-[80px] items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="text-[color:var(--text)] text-lg md:text-xl font-black font-display no-underline">
          LUXE SALON
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="border-0 rounded-full px-4 py-2 text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/10 bg-transparent text-sm font-bold transition-colors">
              {label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/book" className="lux-button">
            <Calendar size={16} /> Book Now
          </Link>
          {user && (
            <button
              onClick={() => {
                logout()
                navigate('/auth')
              }}
              className="lux-button bg-white/10 text-[color:var(--text)]"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-[color:var(--text)]"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/95">
          <div className="lux-container grid gap-2 py-4">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full rounded-2xl p-3 text-left text-sm font-bold text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--text)] transition-colors"
              >
                {label}
              </button>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="lux-button mt-2 w-full"
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
                className="mt-2 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-bold text-[color:var(--text)]"
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
