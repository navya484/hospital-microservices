import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  UserPlus,
  RefreshCw,
  Trash2,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from 'recharts'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody, CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { analyticsService } from '../../services/analyticsService'

export default function AnalyticsPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsService.getSummary,
    refetchInterval: 10_000,
  })

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: analyticsService.getEvents,
    refetchInterval: 10_000,
  })

  // Bar chart data for event distribution
  const distributionData = useMemo(() => {
    return [
      {
        name: 'Registered',
        count: summary?.registered ?? 0,
        color: '#10b981', // emerald-500
      },
      {
        name: 'Updated',
        count: summary?.updated ?? 0,
        color: '#f59e0b', // amber-500
      },
      {
        name: 'Deleted',
        count: summary?.deleted ?? 0,
        color: '#ef4444', // rose-500
      },
    ]
  }, [summary])

  // Timeline data for event stream
  const timelineData = useMemo(() => {
    if (!events || events.length === 0) return []
    const sorted = [...events].sort((a, b) => a.receivedAt - b.receivedAt)
    return sorted.map((evt, idx) => ({
      time: new Date(evt.receivedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      cumulativeEvents: idx + 1,
      eventType: evt.eventType,
      name: evt.name,
    }))
  }, [events])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Stream Intelligence"
        description="Real-time aggregation of patient admission, update, and discharge events consumed from Kafka."
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-100 animate-pulse" />
          ))
        ) : summaryError ? (
          <div className="col-span-4 text-sm text-error-600">Failed to load summary stats.</div>
        ) : (
          <>
            <StatCard
              label="Total Kafka Events"
              value={summary?.totalEvents ?? 0}
              icon={Activity}
              tone="primary"
            />
            <StatCard
              label="Patients Registered"
              value={summary?.registered ?? 0}
              icon={UserPlus}
              tone="success"
            />
            <StatCard
              label="Patients Updated"
              value={summary?.updated ?? 0}
              icon={RefreshCw}
              tone="warning"
            />
            <StatCard
              label="Patients Discharged"
              value={summary?.deleted ?? 0}
              icon={Trash2}
              tone="secondary"
            />
          </>
        )}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-600" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Event Distribution</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Ratio of registrations vs updates vs discharges</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(243, 244, 246, 0.6)' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Activity Timeline Area Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-600" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Cumulative Event Stream</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Timeline of incoming events from Kafka</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 w-full">
              {timelineData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                  No event stream data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="time"
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeEvents"
                      stroke="#0284c7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#eventGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Event log table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Patient Event Log</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Auto-refreshes every 10 seconds {isFetching && '(syncing...)'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh Table
          </button>
        </CardHeader>

        {eventsLoading ? (
          <CardBody>
            <LoadingState variant="skeleton-table" rows={4} />
          </CardBody>
        ) : eventsError ? (
          <CardBody>
            <ErrorState onRetry={() => refetch()} title="Failed to load events" />
          </CardBody>
        ) : !events || events.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={Activity}
              title="No events yet"
              description="Events will appear here as patients are registered, updated, or deleted."
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Patient Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Event Type</th>
                  <th className="px-5 py-3 font-medium">Received At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[...events].reverse().map((event, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-neutral-900">{event.name}</td>
                    <td className="px-5 py-3 text-xs">{event.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.eventType === 'REGISTERED'
                            ? 'bg-success-100 text-success-800'
                            : event.eventType === 'UPDATED'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-error-100 text-error-800'
                        }`}
                      >
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(event.receivedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}