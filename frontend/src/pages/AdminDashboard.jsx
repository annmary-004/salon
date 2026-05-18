import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  Calendar,
  Clock,
  Edit3,
  LayoutDashboard,
  Plus,
  Scissors,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import api from '../api/axios'
import { adminBookings, featuredServices, featuredStylists } from '../data/salonData'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'stylists', label: 'Stylists', icon: Users },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [services, setServices] = useState(featuredServices)
  const [stylists, setStylists] = useState(featuredStylists)
  const [bookings, setBookings] = useState(adminBookings)
  const [draftService, setDraftService] = useState({ name: '', price: '', duration: '', category: 'Hair' })
  const [draftStylist, setDraftStylist] = useState({ name: '', role: '', specialization: '' })

  useEffect(() => {
    Promise.allSettled([api.get('/services'), api.get('/stylists'), api.get('/bookings/all')]).then(([svc, sty, bkg]) => {
      if (svc.status === 'fulfilled' && svc.value.data?.length) setServices(svc.value.data)
      if (sty.status === 'fulfilled' && sty.value.data?.length) setStylists(sty.value.data)
      if (bkg.status === 'fulfilled' && bkg.value.data?.length) setBookings(bkg.value.data)
    })
  }, [])

  const analytics = useMemo(() => {
    const revenue = bookings.reduce((sum, booking) => sum + Number(booking.total || booking.totalPrice || booking.service?.price || 0), 0)
    return [
      { label: 'Daily bookings', value: bookings.length, change: '+12%', icon: Calendar },
      { label: 'Revenue', value: `Rs ${revenue.toLocaleString('en-IN')}`, change: '+18%', icon: TrendingUp },
      { label: 'Active stylists', value: stylists.length, change: 'Live', icon: Users },
      { label: 'Pending', value: bookings.filter((b) => (b.status || '').toLowerCase() === 'pending').length, change: 'Needs review', icon: Clock },
    ]
  }, [bookings, stylists])

  const addService = async () => {
    if (!draftService.name || !draftService.price || !draftService.duration) return toast.info('Add service name, price and duration.')
    const payload = { ...draftService, price: Number(draftService.price), duration: Number(draftService.duration) }
    try {
      const { data } = await api.post('/services', payload)
      setServices((items) => [data, ...items])
      toast.success('Service added.')
    } catch {
      setServices((items) => [{ ...payload, _id: `local-${Date.now()}` }, ...items])
      toast.success('Service added locally. Login as admin to save to API.')
    }
    setDraftService({ name: '', price: '', duration: '', category: 'Hair' })
  }

  const removeService = async (id) => {
    setServices((items) => items.filter((item) => item._id !== id))
    try { await api.delete(`/services/${id}`) } catch {}
    toast.success('Service removed.')
  }

  const addStylist = async () => {
    if (!draftStylist.name || !draftStylist.role) return toast.info('Add stylist name and role.')
    const payload = {
      ...draftStylist,
      specialization: draftStylist.specialization.split(',').map((item) => item.trim()).filter(Boolean),
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=85&w=400',
    }
    try {
      const { data } = await api.post('/stylists', payload)
      setStylists((items) => [data, ...items])
      toast.success('Stylist added.')
    } catch {
      setStylists((items) => [{ ...payload, _id: `local-${Date.now()}` }, ...items])
      toast.success('Stylist added locally. Login as admin to save to API.')
    }
    setDraftStylist({ name: '', role: '', specialization: '' })
  }

  const removeStylist = async (id) => {
    setStylists((items) => items.filter((item) => item._id !== id))
    try { await api.delete(`/stylists/${id}`) } catch {}
    toast.success('Stylist removed.')
  }

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="lux-container grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel h-fit rounded-[34px] p-4 lg:sticky lg:top-24">
          <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--faint)]">Salon Luxe Admin</p>
          <div className="mt-2 grid gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${active === tab.id ? 'bg-[#d9b56f] text-black' : 'text-[color:var(--muted)] hover:bg-white/10 hover:text-[color:var(--text)]'}`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              )
            })}
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="label-pill">Command Center</span>
              <h1 className="mt-4 font-display text-5xl font-black capitalize tracking-[-0.05em]">{active}</h1>
            </div>
            <button onClick={() => setActive('services')} className="lux-button sm:w-auto"><Plus size={18} /> Add Service</button>
          </div>

          {active === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {analytics.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="glass-card rounded-[28px] p-5">
                      <div className="flex items-start justify-between">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><Icon size={21} /></span>
                        <span className="text-xs font-black text-emerald-200">{item.change}</span>
                      </div>
                      <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[color:var(--faint)]">{item.label}</p>
                      <p className="mt-2 text-3xl font-black">{item.value}</p>
                    </div>
                  )
                })}
              </div>
              <BookingTable bookings={bookings} />
            </motion.div>
          )}

          {active === 'bookings' && (
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <BookingTable bookings={bookings} />
              <CalendarPanel bookings={bookings} />
            </div>
          )}

          {active === 'services' && (
            <CrudPanel
              title="Services"
              fields={[
                <input key="name" className="lux-input" placeholder="Service name" value={draftService.name} onChange={(e) => setDraftService({ ...draftService, name: e.target.value })} />,
                <input key="price" className="lux-input" placeholder="Price" value={draftService.price} onChange={(e) => setDraftService({ ...draftService, price: e.target.value })} />,
                <input key="duration" className="lux-input" placeholder="Duration minutes" value={draftService.duration} onChange={(e) => setDraftService({ ...draftService, duration: e.target.value })} />,
              ]}
              onAdd={addService}
            >
              <div className="grid gap-3">
                {services.map((service) => (
                  <Row key={service._id} title={service.name} meta={`${service.category || 'General'} - Rs ${Number(service.price || 0).toLocaleString('en-IN')} - ${service.duration} min`} onDelete={() => removeService(service._id)} />
                ))}
              </div>
            </CrudPanel>
          )}

          {active === 'stylists' && (
            <CrudPanel
              title="Stylists"
              fields={[
                <input key="name" className="lux-input" placeholder="Stylist name" value={draftStylist.name} onChange={(e) => setDraftStylist({ ...draftStylist, name: e.target.value })} />,
                <input key="role" className="lux-input" placeholder="Role" value={draftStylist.role} onChange={(e) => setDraftStylist({ ...draftStylist, role: e.target.value })} />,
                <input key="specialization" className="lux-input" placeholder="Specializations comma separated" value={draftStylist.specialization} onChange={(e) => setDraftStylist({ ...draftStylist, specialization: e.target.value })} />,
              ]}
              onAdd={addStylist}
            >
              <div className="grid gap-3">
                {stylists.map((stylist) => (
                  <Row key={stylist._id} title={stylist.name} meta={`${stylist.role || 'Specialist'} - ${(stylist.specialization || []).join(', ')}`} onDelete={() => removeStylist(stylist._id)} />
                ))}
              </div>
            </CrudPanel>
          )}
        </main>
      </div>
    </div>
  )
}

function BookingTable({ bookings }) {
  return (
    <div className="glass-panel overflow-hidden rounded-[30px]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <h2 className="text-xl font-black">Booking List View</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[color:var(--muted)]">{bookings.length} bookings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--faint)]">
            <tr>
              <th className="px-5 py-4">Client</th>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Stylist</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id || booking.id} className="border-t border-white/10 transition hover:bg-white/[0.045]">
                <td className="px-5 py-4 font-black">{booking.client || booking.user?.name || 'Guest Client'}</td>
                <td className="px-5 py-4 text-[color:var(--muted)]">{booking.service?.name || booking.service}</td>
                <td className="px-5 py-4 text-[color:var(--muted)]">{booking.stylist?.name || booking.stylist}</td>
                <td className="px-5 py-4 text-[color:var(--muted)]">{booking.date} {booking.time}</td>
                <td className="px-5 py-4"><Status status={booking.status || 'confirmed'} /></td>
                <td className="px-5 py-4 text-right font-black">Rs {Number(booking.total || booking.totalPrice || booking.service?.price || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CalendarPanel({ bookings }) {
  return (
    <div className="glass-panel rounded-[30px] p-5">
      <h2 className="text-xl font-black">Calendar View</h2>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-black text-[color:var(--faint)]">
        {['M','T','W','T','F','S','S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, index) => (
          <div key={index} className={`aspect-square rounded-2xl border border-white/10 p-2 text-sm font-black ${[3,8,14,22].includes(index) ? 'bg-[#d9b56f] text-black' : 'bg-white/[0.045]'}`}>
            {index + 1}
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {bookings.slice(0, 3).map((booking) => (
          <div key={booking._id || booking.id} className="rounded-2xl bg-white/[0.055] p-4">
            <p className="font-black">{booking.service?.name || booking.service}</p>
            <p className="text-sm text-[color:var(--muted)]">{booking.time} with {booking.stylist?.name || booking.stylist}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CrudPanel({ title, fields, onAdd, children }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="glass-panel h-fit rounded-[30px] p-5">
        <h2 className="text-xl font-black">Add {title.slice(0, -1)}</h2>
        <div className="mt-5 grid gap-3">{fields}</div>
        <button onClick={onAdd} className="lux-button mt-4"><Plus size={18} /> Save</button>
      </div>
      <div className="glass-panel rounded-[30px] p-5">
        <h2 className="mb-5 text-xl font-black">Manage {title}</h2>
        {children}
      </div>
    </div>
  )
}

function Row({ title, meta, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{meta}</p>
      </div>
      <div className="flex gap-2">
        <button className="ghost-button !h-10 !min-h-0 !w-10 !p-0"><Edit3 size={16} /></button>
        <button onClick={onDelete} className="ghost-button !h-10 !min-h-0 !w-10 !p-0 text-red-200"><Trash2 size={16} /></button>
      </div>
    </div>
  )
}

function Status({ status }) {
  const tone = {
    confirmed: 'bg-emerald-400/14 text-emerald-200',
    pending: 'bg-amber-400/14 text-amber-200',
    completed: 'bg-sky-400/14 text-sky-200',
    cancelled: 'bg-red-400/14 text-red-200',
  }[status] || 'bg-white/10 text-[color:var(--muted)]'

  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${tone}`}>{status}</span>
}
