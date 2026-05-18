import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { featuredServices, featuredStylists, timeSlots } from '../data/salonData'

const steps = ['Service', 'Stylist', 'Date & Time', 'Confirm']

const stepMotion = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
}

function normalizeService(item) {
  return {
    ...item,
    _id: item._id || item.id,
    image: item.image || featuredServices[0].image,
    icon: item.icon || Sparkles,
  }
}

function normalizeStylist(item) {
  return {
    ...item,
    _id: item._id || item.id,
    avatar: item.avatar || item.av || featuredStylists[0].avatar,
    role: item.role || 'Luxe Specialist',
    specialization: Array.isArray(item.specialization) ? item.specialization : [item.spec || 'Signature Services'],
    reviews: item.reviews || 120,
  }
}

export default function Booking() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [stylists, setStylists] = useState([])
  const [availableSlots, setAvailableSlots] = useState(timeSlots)
  const [loading, setLoading] = useState(true)
  const [slotLoading, setSlotLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState({
    service: null,
    stylist: null,
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    let mounted = true
    Promise.allSettled([api.get('/services'), api.get('/stylists')])
      .then(([serviceRes, stylistRes]) => {
        if (!mounted) return
        if (serviceRes.status === 'fulfilled' && Array.isArray(serviceRes.value.data) && serviceRes.value.data.length) {
          setServices(serviceRes.value.data.map(normalizeService))
        }
        if (stylistRes.status === 'fulfilled' && Array.isArray(stylistRes.value.data) && stylistRes.value.data.length) {
          setStylists(stylistRes.value.data.map(normalizeStylist))
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!booking.stylist?._id || !booking.date) return
    setSlotLoading(true)
    api.get('/bookings/slots', { params: { stylistId: booking.stylist._id, date: booking.date } })
      .then((res) => setAvailableSlots(res.data?.length ? res.data : []))
      .catch(() => setAvailableSlots(timeSlots))
      .finally(() => setSlotLoading(false))
  }, [booking.stylist, booking.date])

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(booking.service)
    if (step === 1) return Boolean(booking.stylist)
    if (step === 2) return Boolean(booking.date && booking.time)
    return Boolean(booking.name && booking.phone && booking.email)
  }, [booking, step])

  const next = () => {
    if (!canContinue) {
      toast.info('Complete this step to continue.')
      return
    }
    setStep((value) => Math.min(value + 1, steps.length - 1))
  }

  const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)

  const submit = async () => {
    if (!canContinue) {
      toast.info('Add your contact details before confirming.')
      return
    }

    if (!booking.service?._id || !booking.stylist?._id || !isValidObjectId(booking.service._id) || !isValidObjectId(booking.stylist._id)) {
      toast.error('Please select a valid service and stylist from the available list.')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/bookings', {
        service: booking.service._id,
        stylist: booking.stylist._id,
        date: booking.date,
        time: booking.time,
        notes: `${booking.notes || ''} Client: ${booking.name}, ${booking.phone}, ${booking.email}`,
      })
      toast.success('Appointment confirmed. Email confirmation is on its way.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not confirm this slot.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="lux-container py-20">
        <div className="skeleton h-[520px] rounded-[34px]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center px-4 py-12">
        <div className="lux-container">
          <div className="glass-panel mx-auto max-w-2xl rounded-[34px] p-8 text-center sm:p-12">
            <span className="label-pill mx-auto"><ShieldCheck size={13} /> Verification Required</span>
            <h1 className="mt-6 font-display text-4xl sm:text-6xl font-black leading-none tracking-[-0.05em]">
              Sign In to <span className="gold-text">Book</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[color:var(--muted)]">
              Create your account or sign in to reserve your appointment slot at Salon Luxe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/auth" state={{ from: location.pathname }} className="lux-button sm:w-auto">Login / Register</Link>
              <Link to="/" className="ghost-button sm:w-auto">Back Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="lux-container">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="label-pill"><CalendarDays size={13} /> Appointment Studio</span>
            <h1 className="mt-5 font-display text-5xl font-black leading-none tracking-[-0.05em] sm:text-7xl">
              Reserve your <span className="gold-text">luxe</span> slot.
            </h1>
            <p className="mt-4 text-[color:var(--muted)]">Four smooth steps, live slot checks and a confirmation flow wired for the Salon Luxe API.</p>
          </div>

          <div className="glass-panel rounded-[30px] p-4">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((label, index) => (
                <button
                  key={label}
                  onClick={() => index <= step && setStep(index)}
                  className={`rounded-2xl px-2 py-4 text-center transition ${index <= step ? 'bg-white/12 text-[color:var(--text)]' : 'bg-white/5 text-[color:var(--faint)]'}`}
                >
                  <span className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-black ${index < step ? 'bg-emerald-400 text-black' : index === step ? 'bg-[#d9b56f] text-black' : 'bg-white/10'}`}>
                    {index < step ? <Check size={15} /> : index + 1}
                  </span>
                  <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.12em]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="glass-panel min-h-[620px] rounded-[34px] p-4 sm:p-7">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1,2,3,4].map((item) => <div key={item} className="skeleton h-56 rounded-[28px]" />)}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="service" {...stepMotion}>
                    <StepHeader title="Select service" copy="Choose the ritual your appointment should be built around." />
                    <div className="grid gap-4 md:grid-cols-2">
                      {services.map((service) => {
                        const Icon = service.icon || Sparkles
                        const selected = booking.service?._id === service._id
                        return (
                          <button
                            key={service._id}
                            onClick={() => setBooking({ ...booking, service })}
                            className={`group rounded-[28px] border p-4 text-left transition hover:-translate-y-1 ${selected ? 'border-[#d9b56f] bg-[#d9b56f]/12' : 'border-white/10 bg-white/[0.045] hover:border-white/22'}`}
                          >
                            <div className="relative h-44 overflow-hidden rounded-[22px]">
                              <img src={service.image} alt={service.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/16 text-white backdrop-blur-xl"><Icon size={20} /></span>
                            </div>
                            <div className="mt-4 flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-black">{service.name}</h3>
                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">{service.description}</p>
                              </div>
                              <ChevronRight className="mt-1 shrink-0 text-[color:var(--faint)]" size={18} />
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                              <span className="font-black gold-text">Rs {Number(service.price).toLocaleString('en-IN')}</span>
                              <span className="flex items-center gap-2 text-sm text-[color:var(--muted)]"><Clock size={15} /> {service.duration} min</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="stylist" {...stepMotion}>
                    <StepHeader title="Select stylist" copy="Pick a specialist whose craft matches your service." />
                    <div className="grid gap-4 md:grid-cols-2">
                      {stylists.map((stylist) => {
                        const selected = booking.stylist?._id === stylist._id
                        return (
                          <button
                            key={stylist._id}
                            onClick={() => setBooking({ ...booking, stylist })}
                            className={`rounded-[28px] border p-4 text-left transition hover:-translate-y-1 ${selected ? 'border-[#d9b56f] bg-[#d9b56f]/12' : 'border-white/10 bg-white/[0.045] hover:border-white/22'}`}
                          >
                            <div className="flex gap-4">
                              <img src={stylist.avatar} alt={stylist.name} className="h-24 w-24 rounded-3xl object-cover" />
                              <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-black">{stylist.name}</h3>
                                <p className="text-sm font-semibold text-[color:var(--faint)]">{stylist.role}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                                  <Star size={15} fill="currentColor" className="text-[#d9b56f]" /> {stylist.rating} <span className="text-[color:var(--faint)]">({stylist.reviews})</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {stylist.specialization.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-[color:var(--muted)]">{tag}</span>
                              ))}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="time" {...stepMotion}>
                    <StepHeader title="Pick date and time" copy="Slots are checked against existing pending and confirmed bookings." />
                    <div className="grid gap-5">
                      <label className="grid gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--faint)]">Date</span>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={booking.date}
                          onChange={(event) => setBooking({ ...booking, date: event.target.value, time: '' })}
                          className="lux-input"
                        />
                      </label>

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--faint)]">Available Time</span>
                          {slotLoading && <span className="flex items-center gap-2 text-xs font-bold text-[color:var(--muted)]"><Loader2 size={14} className="animate-spin" /> Checking</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {timeSlots.map((slot) => {
                            const disabled = booking.date && !availableSlots.includes(slot)
                            const selected = booking.time === slot
                            return (
                              <button
                                key={slot}
                                disabled={!booking.date || disabled}
                                onClick={() => setBooking({ ...booking, time: slot })}
                                className={`rounded-2xl border px-4 py-4 font-black transition ${selected ? 'border-[#d9b56f] bg-[#d9b56f] text-black' : disabled ? 'cursor-not-allowed border-white/5 bg-white/5 text-[color:var(--faint)] line-through' : 'border-white/10 bg-white/[0.055] text-[color:var(--text)] hover:border-white/25'}`}
                              >
                                {slot}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="confirm" {...stepMotion}>
                    <StepHeader title="Confirm details" copy="Add client details for confirmation and reminders." />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input icon={User} placeholder="Full name" value={booking.name} onChange={(name) => setBooking({ ...booking, name })} />
                      <Input icon={Phone} placeholder="Phone number" value={booking.phone} onChange={(phone) => setBooking({ ...booking, phone })} />
                      <Input icon={Mail} placeholder="Email address" value={booking.email} onChange={(email) => setBooking({ ...booking, email })} />
                      <input className="lux-input" placeholder="Notes or preferences" value={booking.notes} onChange={(event) => setBooking({ ...booking, notes: event.target.value })} />
                    </div>
                    <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.055] p-5">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-1 text-emerald-200" size={22} />
                        <div>
                          <p className="font-black">Double-booking protection</p>
                          <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">The API checks stylist, date and time before confirming. If another client takes this slot first, the booking is rejected.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="ghost-button disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
                <ArrowLeft size={18} /> Back
              </button>
              {step < steps.length - 1 ? (
                <button onClick={next} className="lux-button sm:w-auto">
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="lux-button sm:w-auto">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Confirm Booking
                </button>
              )}
            </div>
          </div>

          <aside className="glass-panel h-fit rounded-[34px] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--faint)]">Booking Summary</p>
            <div className="mt-5 space-y-4">
              <Summary label="Service" value={booking.service?.name || 'Not selected'} />
              <Summary label="Stylist" value={booking.stylist?.name || 'Not selected'} />
              <Summary label="Date" value={booking.date || 'Not selected'} />
              <Summary label="Time" value={booking.time || 'Not selected'} />
            </div>
            <div className="mt-6 rounded-[26px] bg-black/20 p-5">
              <p className="text-sm text-[color:var(--muted)]">Estimated total</p>
              <p className="mt-1 text-4xl font-black gold-text">Rs {Number(booking.service?.price || 0).toLocaleString('en-IN')}</p>
              <p className="mt-2 text-xs leading-6 text-[color:var(--faint)]">Final price may change after consultation for color corrections or add-ons.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ title, copy }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{copy}</p>
    </div>
  )
}

function Summary({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0">
      <span className="text-sm text-[color:var(--faint)]">{label}</span>
      <span className="max-w-[190px] text-right text-sm font-black">{value}</span>
    </div>
  )
}

function Input({ icon: Icon, value, onChange, placeholder }) {
  return (
    <label className="relative block">
      <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--faint)]" />
      <input className="lux-input pl-12" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
