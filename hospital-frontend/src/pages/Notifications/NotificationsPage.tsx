import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  Search,
  UserPlus,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody, CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { notificationService } from '../../services/notificationService'

const eventTypeStyles: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  REGISTERED: {
    label: 'Registered',
    bg: 'bg-success-50',
    text: 'text-success-700',
    dot: 'bg-success-500',
  },
  PATIENT_CREATED: {
    label: 'Registered',
    bg: 'bg-success-50',
    text: 'text-success-700',
    dot: 'bg-success-500',
  },
  UPDATED: {
    label: 'Updated',
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    dot: 'bg-warning-500',
  },
  PATIENT_UPDATED: {
    label: 'Updated',
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    dot: 'bg-warning-500',
  },
  DELETED: {
    label: 'Discharged / Deleted',
    bg: 'bg-error-50',
    text: 'text-error-700',
    dot: 'bg-error-500',
  },
  PATIENT_DELETED: {
    label: 'Discharged / Deleted',
    bg: 'bg-error-50',
    text: 'text-error-700',
    dot: 'bg-error-500',
  },
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | 'REGISTERED' | 'UPDATED' | 'DELETED'>('ALL')

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 10_000,
  })

  // KPI calculations
  const metrics = useMemo(() => {
    if (!notifications) return { total: 0, registered: 0, updated: 0, deleted: 0 }
    const total = notifications.length
    const registered = notifications.filter((n) => n.eventType === 'REGISTERED' || n.eventType === 'PATIENT_CREATED').length
    const updated = notifications.filter((n) => n.eventType === 'UPDATED' || n.eventType === 'PATIENT_UPDATED').length
    const deleted = notifications.filter((n) => n.eventType === 'DELETED' || n.eventType === 'PATIENT_DELETED').length
    return { total, registered, updated, deleted }
  }, [notifications])

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (!notifications) return []
    return [...notifications].reverse().filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesTab =
        activeTab === 'ALL' ||
        n.eventType === activeTab ||
        (activeTab === 'REGISTERED' && n.eventType === 'PATIENT_CREATED') ||
        (activeTab === 'UPDATED' && n.eventType === 'PATIENT_UPDATED') ||
        (activeTab === 'DELETED' && n.eventType === 'PATIENT_DELETED')
      return matchesSearch && matchesTab
    })
  }, [notifications, searchTerm, activeTab])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Event Feed"
        description="Audit log of asynchronous patient notifications emitted through Apache Kafka."
        actions={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live SSE Active
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Notifications"
          value={metrics.total}
          icon={Bell}
          tone="primary"
        />
        <StatCard
          label="Registrations"
          value={metrics.registered}
          icon={UserPlus}
          tone="success"
        />
        <StatCard
          label="Record Updates"
          value={metrics.updated}
          icon={RefreshCw}
          tone="warning"
        />
        <StatCard
          label="Discharges / Deletions"
          value={metrics.deleted}
          icon={Trash2}
          tone="secondary"
        />
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            {(['ALL', 'REGISTERED', 'UPDATED', 'DELETED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-xs relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardHeader>

        {isLoading ? (
          <CardBody>
            <LoadingState variant="skeleton-table" rows={4} />
          </CardBody>
        ) : isError ? (
          <CardBody>
            <ErrorState
              onRetry={() => refetch()}
              title="Failed to load notifications"
            />
          </CardBody>
        ) : !notifications || notifications.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={Bell}
              title="No notifications dispatched yet"
              description="Notifications will automatically record here in real-time when clinical patient events occur."
            />
          </CardBody>
        ) : filteredNotifications.length === 0 ? (
          <CardBody>
            <div className="p-8 text-center text-sm text-neutral-500">
              No notifications match your search or filter tab.
            </div>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Event Type</th>
                  <th className="px-5 py-3 font-medium">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredNotifications.map((n, idx) => {
                  const style = eventTypeStyles[n.eventType] ?? {
                    label: n.eventType,
                    bg: 'bg-neutral-50',
                    text: 'text-neutral-700',
                    dot: 'bg-neutral-400',
                  }

                  return (
                    <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-neutral-900">{n.name}</td>
                      <td className="px-5 py-3 text-neutral-500 text-xs">{n.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-400 text-xs whitespace-nowrap">
                        {n.sentAt ? new Date(n.sentAt).toLocaleString() : 'Just now'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}