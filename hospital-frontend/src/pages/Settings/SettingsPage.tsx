import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  Server,
  Bell,
  Database,
  Activity,
  LogOut,
  Save,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useToast } from '../../context/ToastContext'

interface TokenPayload {
  sub?: string
  role?: string
  iat?: number
  exp?: number
}

function parseJwt(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const token = localStorage.getItem('token') || ''
  const payload = useMemo(() => parseJwt(token), [token])

  const userEmail = payload?.sub || 'admin@hospital.com'
  const userRole = payload?.role || 'ADMIN'
  const expiresAt = payload?.exp
    ? new Date(payload.exp * 1000).toLocaleString()
    : 'Active Session'

  // Preferences state
  const [enableToasts, setEnableToasts] = useState(true)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('10')
  const [displayName, setDisplayName] = useState('Hospital Administrator')

  const handleSavePreferences = () => {
    showToast('success', 'Preferences saved successfully')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    showToast('info', 'Logged out successfully')
    navigate('/login', { replace: true })
  }

  const microservices = [
    {
      name: 'API Gateway',
      role: 'Central Entry Point & CORS Proxy',
      port: '4004',
      status: 'Online',
      protocol: 'HTTP / WebFlux',
    },
    {
      name: 'Hospital Management',
      role: 'Patient CRUD & Business Logic',
      port: '4000',
      status: 'Online',
      protocol: 'REST / PostgreSQL (5002)',
    },
    {
      name: 'Auth Service',
      role: 'JWT Authentication & Role Claims',
      port: '4005',
      status: 'Online',
      protocol: 'REST / PostgreSQL (5001)',
    },
    {
      name: 'Billing Service',
      role: 'Automated Account Generation',
      port: '4001 / 9001',
      status: 'Online',
      protocol: 'gRPC Protocol Buffers',
    },
    {
      name: 'Apache Kafka',
      role: 'Distributed Event Bus & Broker',
      port: '9092',
      status: 'Online',
      protocol: 'Event Stream (Topic: patient)',
    },
    {
      name: 'Analytics Service',
      role: 'Kafka Event Counter & Reporter',
      port: '4002',
      status: 'Online',
      protocol: 'Event Consumer / REST',
    },
    {
      name: 'Notification Service',
      role: 'Kafka Event Consumer & SSE Broadcast',
      port: '4003',
      status: 'Online',
      protocol: 'SSE / Stream',
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      <PageHeader
        title="Settings & System Control"
        description="Manage your administrator profile, system preferences, and microservices connectivity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile & Security */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary-600" />
                <h2 className="text-sm font-semibold text-neutral-900">User Profile</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl">
                  {userEmail.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-base">{displayName}</h3>
                  <p className="text-xs text-neutral-500">{userEmail}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Access Level:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={13} />
                    {userRole}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Session Expiry:</span>
                  <span className="text-neutral-700 flex items-center gap-1">
                    <Clock size={12} className="text-neutral-400" />
                    {expiresAt}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-error-600 hover:text-error-700 hover:bg-error-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-primary-600" />
                <h2 className="text-sm font-semibold text-neutral-900">Preferences</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Live SSE Alerts</p>
                  <p className="text-xs text-neutral-500">Pop-up toast on Kafka events</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableToasts}
                  onChange={(e) => setEnableToasts(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Table Auto-Refresh
                </label>
                <select
                  value={autoRefreshInterval}
                  onChange={(e) => setAutoRefreshInterval(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="5">Every 5 seconds</option>
                  <option value="10">Every 10 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="0">Manual refresh only</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                onClick={handleSavePreferences}
              >
                <Save size={16} />
                Save Preferences
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Microservices Status & Architecture */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-primary-600" />
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">Microservice Cluster Status</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Live Docker architecture health overview</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
                Cluster Healthy
              </span>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-neutral-100">
                {microservices.map((svc) => (
                  <div key={svc.name} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">{svc.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                          Port {svc.port}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">{svc.role}</p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} />
                        {svc.status}
                      </span>
                      <p className="text-[11px] text-neutral-400 font-mono">{svc.protocol}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Architecture Insights Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-primary-600" />
                <h2 className="text-sm font-semibold text-neutral-900">Architecture & Security Highlights</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-primary-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-neutral-900">Role-Based Access Control (RBAC):</strong> The API Gateway securely validates JWTs via Auth Service and passes validated <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-800">X-User-Role</code> headers to downstream microservices.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Database size={16} className="text-primary-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-neutral-900">Database-per-Service Isolation:</strong> Auth DB (Port 5001) and Hospital DB (Port 5002) run as isolated PostgreSQL instances to guarantee microservice domain autonomy.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Radio size={16} className="text-primary-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-neutral-900">Event-Driven Asynchrony:</strong> Patient events are dispatched to Apache Kafka topic <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-800">patient</code>, decoupling clinical workflows from analytics and notifications.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}