import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { ArrowRight, Lock, Mail, Phone, Scissors, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Auth({ adminOnly = false }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/book'
  const buttonLabel = loading ? 'Please wait...' : isLogin ? (adminOnly ? 'Login as admin' : 'Login and Book') : 'Create Account'
  const showRegisterToggle = !adminOnly

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const data = await login(form.email, form.password)
        if (data.role === 'admin') {
          toast.success('Welcome back, admin.')
          navigate('/admin')
        } else {
          toast.success('Logged in. You can book now.')
          navigate(redirectTo)
        }
      } else {
        await register(form.name, form.email, form.password, form.phone)
        toast.success('Registration completed. Please login to book.')
        setIsLogin(true)
        setForm({ ...form, password: '' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="lux-container grid min-h-[calc(100vh-170px)] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block">
          <span className="label-pill"><Scissors size={13} /> Members Only</span>
          <h1 className="mt-6 font-display text-6xl sm:text-7xl font-black leading-none tracking-[-0.06em]">
            Secure Your <span className="gold-text block">Luxury Slot.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--muted)]">
            We protect appointment slots behind verified accounts. Every booking ensures a confirmed profile and complete history.
          </p>
        </motion.div>

        <motion.div layout className="glass-panel mx-auto w-full max-w-md rounded-[34px] p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#fff3cf] via-[#d9b56f] to-[#e8a7a1] text-black shadow-lg">
                <Lock size={24} />
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.04em] mb-2">{adminOnly ? 'Admin Login' : isLogin ? 'Welcome Back' : 'Join Us'}</h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              {adminOnly
                ? 'Sign in with your admin credentials to access the dashboard.'
                : isLogin
                  ? 'Sign in to book your appointment at Salon Luxe.'
                  : 'Create an account to start booking with us.'}
            </p>
          </div>

          {showRegisterToggle && (
            <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.055] p-2">
              <button onClick={() => setIsLogin(true)} className={`rounded-xl py-3 px-4 text-sm font-bold transition duration-200 ${isLogin ? 'bg-[#d9b56f] text-black shadow-md' : 'text-[color:var(--muted)] hover:text-white'}`}>
                Login
              </button>
              <button onClick={() => setIsLogin(false)} className={`rounded-xl py-3 px-4 text-sm font-bold transition duration-200 ${!isLogin ? 'bg-[#d9b56f] text-black shadow-md' : 'text-[color:var(--muted)] hover:text-white'}`}>
                Register
              </button>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <Field icon={User} placeholder="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
                  <Field icon={Phone} placeholder="Phone number" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
                </motion.div>
              )}
            </AnimatePresence>

            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={(email) => setForm({ ...form, email })} />
            <Field icon={Lock} type="password" placeholder="Password" value={form.password} onChange={(password) => setForm({ ...form, password })} />

            <button disabled={loading} className="lux-button w-full mt-6">
              {buttonLabel} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            {!adminOnly && (
              <p className="text-center text-sm text-[color:var(--muted)]">
                {isLogin ? "Don't have an account? " : 'Already registered? '}{' '}
                <button onClick={() => setIsLogin(!isLogin)} className="font-black text-[#d9b56f] hover:text-[#fff3cf] transition">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            )}
            <Link to="/" className="block text-center text-sm font-bold text-[color:var(--faint)] no-underline hover:text-[color:var(--text)] transition">
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="relative block">
      <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--faint)]" />
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="lux-input pl-14 w-full text-base placeholder:text-[color:var(--muted)]"
      />
    </label>
  )
}
