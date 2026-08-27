import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, ShieldCheck, Activity, Users } from 'lucide-react'
import axios from 'axios'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setIsLoading(true)
    try {
      const { token } = await authService.login({ email, password })
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setFormError('Invalid email or password.')
        } else if (err.request) {
          setFormError('Could not reach the server. Please try again.')
        } else {
          setFormError('Something went wrong. Please try again.')
        }
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white/10 backdrop-blur-sm">
              <Stethoscope size={22} />
            </div>
            <div>
              <p className="font-semibold">Hospital Management</p>
              <p className="text-sm text-primary-100">Healthcare Platform</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl font-bold leading-tight mb-4">
              Run your hospital operations with clarity and control.
            </h1>
            <p className="text-primary-100 text-base leading-relaxed">
              A unified platform for patient records, billing, and care coordination —
              built for modern healthcare teams.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 shrink-0">
                  <Users size={18} />
                </div>
                <p className="text-sm text-primary-50">
                  Centralized patient records and registration
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 shrink-0">
                  <Activity size={18} />
                </div>
                <p className="text-sm text-primary-50">
                  Real-time operational and billing visibility
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-sm text-primary-50">
                  Secure, role-based access to sensitive data
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-primary-200">
            © {new Date().getFullYear()} Hospital Management. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-neutral-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-600 text-white">
              <Stethoscope size={20} />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Hospital Management</p>
              <p className="text-sm text-neutral-500">Healthcare Platform</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            Sign in to your Hospital Management System
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {formError && (
              <div
                role="alert"
                className="rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
              >
                {formError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}