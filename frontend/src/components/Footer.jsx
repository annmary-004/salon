import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Scissors } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="lux-container grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 no-underline">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#fff3cf] via-[#d9b56f] to-[#e8a7a1] text-black">
              <Scissors size={20} />
            </span>
            <span className="font-display text-2xl font-black text-[color:var(--text)]">Salon Luxe</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[color:var(--muted)]">Premium salon booking for cuts, color, skin rituals and bridal artistry with a smooth digital experience.</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--faint)]">Visit</h3>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <span className="flex gap-2"><MapPin size={16} className="text-[#d9b56f]" /> MG Road, Kochi, Kerala</span>
            <span className="flex gap-2"><Phone size={16} className="text-[#d9b56f]" /> +91 80780 35932</span>
            <span className="flex gap-2"><Mail size={16} className="text-[#d9b56f]" /> hello@salonluxe.in</span>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--faint)]">Book</h3>
          <div className="mt-4 grid gap-3">
            <Link to="/book" className="ghost-button">Book appointment</Link>
            <a href="https://instagram.com" className="ghost-button" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>
          </div>
        </div>
      </div>
      <div className="lux-container mt-10 border-t border-white/10 pt-6 text-xs text-[color:var(--faint)]">
        © 2026 Salon Luxe. All rights reserved.
      </div>
    </footer>
  )
}
