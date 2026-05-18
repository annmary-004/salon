import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Crown,
  Instagram,
  MapPin,
  Play,
  Star,
  UserRoundCheck,
} from 'lucide-react'
import {
  featuredServices,
  featuredStylists,
  heroSlides,
  premiumHighlights,
} from '../data/salonData'

function Hero() {
  const current = heroSlides[0]

  return (
    <section id="home" className="relative -mt-20 min-h-[100svh] overflow-hidden pt-20">
      <img
        src={current.image}
        alt={current.title}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.42),rgba(0,0,0,0.72))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[color:var(--bg)] to-transparent" />

      <div className="lux-container relative z-10 grid min-h-[calc(100svh-80px)] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.78fr]">
        <div className="max-w-3xl">
          <span className="label-pill"><Crown size={13} /> {current.eyebrow}</span>
          <h1 className="mt-6 font-display text-[clamp(4.2rem,16vw,10.5rem)] font-black leading-[0.78] tracking-[-0.06em] text-white">
            {current.title.split(' ')[0]} <span className="gold-text block">{current.title.split(' ').slice(1).join(' ') || 'Luxe'}</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            {current.copy}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/book" className="lux-button">
              <Calendar size={19} /> Book Appointment
            </Link>
            <a href="#services" className="ghost-button">
              Explore Services <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="glass-panel hidden rounded-[34px] p-5 lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
            <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=90&w=900" alt="Luxury salon treatment" className="h-full w-full object-cover" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/10" />
            <button className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-full bg-white/18 text-white transition hover:scale-105">
              <Play size={22} fill="currentColor" />
            </button>
            <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-black/50 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/58">Next opening</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-black">Today, 4:00 PM</p>
                  <p className="text-sm text-white/65">Gloss Color Ritual with Noah</p>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-200">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lux-container relative z-10 -mt-14 grid gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {premiumHighlights.map((item, index) => (
          <div key={item.label} className="glass-card rounded-3xl p-5">
            <p className="text-3xl font-black text-[color:var(--text)]">{item.value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--faint)]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="lux-container">
        <div className="max-w-2xl">
          <span className="label-pill">Curated Services</span>
          <h2 className="mt-5 font-display text-5xl font-black leading-none tracking-[-0.04em] sm:text-7xl">
            Every ritual feels <span className="gold-text">bespoke</span>.
          </h2>
          <p className="mt-5 text-[color:var(--muted)]">Transparent pricing, real durations, premium products and a booking path that never makes your client think twice.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredServices.map((service) => {
            const Icon = service.icon
            return (
              <article
                key={service._id}
                className="overflow-hidden rounded-[30px] glass-card"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={service.image} alt={service.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/8 to-transparent" />
                  <div className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/16 text-white">
                    <Icon size={22} />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">{service.category}</p>
                    <h3 className="mt-1 text-2xl font-black text-white">{service.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="min-h-[52px] text-sm leading-7 text-[color:var(--muted)]">{service.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-2xl font-black gold-text">Rs {service.price.toLocaleString('en-IN')}</span>
                    <span className="flex items-center gap-2 text-sm font-bold text-[color:var(--muted)]"><Clock size={16} /> {service.duration} min</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Stylists() {
  return (
    <section id="stylists" className="py-20 sm:py-28">
      <div className="lux-container">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="label-pill"><UserRoundCheck size={13} /> Select Your Artist</span>
            <h2 className="mt-5 font-display text-5xl font-black leading-none tracking-[-0.04em] sm:text-7xl">Specialists with signature hands.</h2>
          </div>
          <Link to="/book" className="ghost-button lg:w-auto">Choose in booking <ArrowRight size={18} /></Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredStylists.map((stylist) => (
            <article
              key={stylist._id}
              className="glass-card rounded-[30px] p-4"
            >
              <img src={stylist.avatar} alt={stylist.name} className="h-72 w-full rounded-[24px] object-cover" loading="lazy" decoding="async" />
              <div className="p-3">
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{stylist.name}</h3>
                    <p className="text-sm font-semibold text-[color:var(--faint)]">{stylist.role}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-black">
                    <Star size={14} fill="currentColor" className="text-[#d9b56f]" /> {stylist.rating}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stylist.specialization.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-[color:var(--muted)]">{item}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const items = ['Background image slider', 'Glass booking cards', 'Fast page browsing', 'Dark and light modes', 'WhatsApp quick booking', 'JWT ready API integration']

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="lux-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="label-pill"><Instagram size={13} /> Scene Ready</span>
          <h2 className="mt-5 font-display text-5xl font-black leading-none tracking-[-0.04em] sm:text-7xl">Built for the client who notices details.</h2>
          <p className="mt-5 text-[color:var(--muted)]">Micro-interactions, layered blur, soft gradients and clean spacing create a premium booking experience without visual clutter.</p>
          <div className="mt-8 grid gap-3">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-[color:var(--muted)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/14 text-emerald-200"><Check size={15} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[36px] p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=90&w=900" alt="Salon interior" className="h-80 rounded-[28px] object-cover sm:h-[520px]" loading="lazy" decoding="async" />
            <div className="grid gap-4">
              <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=90&w=900" alt="Makeup station" className="h-60 rounded-[28px] object-cover" loading="lazy" decoding="async" />
              <div className="rounded-[28px] border border-white/10 bg-white/8 p-6">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[color:var(--faint)]">Conversion focus</p>
                <p className="mt-4 text-4xl font-black gold-text">4 steps</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Service, stylist, time and confirmation with double-booking validation on the server.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Stylists />
      <Experience />
      <section id="contact" className="pb-24 pt-10">
        <div className="lux-container glass-panel rounded-[34px] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="label-pill"><MapPin size={13} /> Kochi, Kerala</span>
              <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.04em] sm:text-6xl">Ready for your luxe slot?</h2>
              <p className="mt-4 max-w-2xl text-[color:var(--muted)]">Book online, confirm by WhatsApp, and receive an email confirmation when SMTP is configured.</p>
            </div>
            <Link to="/book" className="lux-button lg:w-auto">
              Book Appointment <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
