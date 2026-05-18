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

  const linkClass = 'rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--muted)] transition hover:bg-white/10 hover:text-[color:var(--text)]'

  return (
    <header className="relative z-50 border-b border-white/10 bg-black/[0.88]">
      <nav className="lux-container flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link to="/" onClick={() => setOpen(false)} className="flex flex-shrink-0 items-center gap-2">
          <span className="font-display font-black text-lg sm:text-xl text-[color:var(--text)] hover:text-[#d9b56f] transition">
            LUXE SALON
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className={linkClass}>{label}</button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/book" className="lux-button text-sm">
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

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-white/[0.08] text-[color:var(--text)] lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-black/[0.95] lg:hidden">
          <div className="lux-container grid gap-2 py-4">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="rounded-2xl px-4 py-3 text-left text-sm font-bold text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--text)]"
              >
                {label}
              </button>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="lux-button mt-2 text-sm"
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
