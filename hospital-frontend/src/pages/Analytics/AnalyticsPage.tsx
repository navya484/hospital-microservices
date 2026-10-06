import { useQuery } from '@tanstack/react-query'
import { Activity, UserPlus, RefreshCw, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody, CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { analyticsService } from '../../services/analyticsService'

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsService.getSummary,
    refetchInterval: 10_000, // auto-refresh every 10 seconds
  })

  const { data: events, isLoading: eventsLoading, isError: eventsError, refetch } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: analyticsService.getEvents,
    refetchInterval: 10_000,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Live overview of patient events received from Kafka."
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-100 animate-pulse" />
          ))
        ) : summaryError ? (
          <div className="col-span-4 text-sm text-error-600">Failed to load summary stats.</div>
        ) : (
          <>
            <StatCard label="Total Events" value={summary?.totalEvents ?? 0} icon={Activity} tone="primary" />
            <StatCard label="Patients Registered" value={summary?.registered ?? 0} icon={UserPlus} tone="success" />
            <StatCard label="Patients Updated" value={summary?.updated ?? 0} icon={RefreshCw} tone="warning" />
            <StatCard label="Patients Deleted" value={summary?.deleted ?? 0} icon={Trash2} tone="secondary" />
          </>
        )}
      </div>

      {/* Event log table */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-neutral-900">Patient Event Log</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Auto-refreshes every 10 seconds</p>
        </CardHeader>
        {eventsLoading ? (
          <CardBody><LoadingState variant="skeleton-table" rows={4} /></CardBody>
        ) : eventsError ? (
          <CardBody><ErrorState onRetry={() => refetch()} title="Failed to load events" /></CardBody>
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
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{event.name}</td>
                    <td className="px-5 py-3">{event.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.eventType === 'REGISTERED'
                          ? 'bg-success-100 text-success-800'
                          : event.eventType === 'UPDATED'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 text-xs">
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