import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody } from '../../components/ui/Card'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { notificationService } from '../../services/notificationService'

const eventTypeColors: Record<string, string> = {
  REGISTERED: 'bg-success-100 text-success-800',
  UPDATED: 'bg-warning-100 text-warning-800',
  DELETED: 'bg-error-100 text-error-800',
}

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 10_000,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="All patient notifications dispatched by the system."
      />

      <Card>
        {isLoading ? (
          <CardBody><LoadingState variant="skeleton-table" rows={4} /></CardBody>
        ) : isError ? (
          <CardBody><ErrorState onRetry={() => refetch()} title="Failed to load notifications" /></CardBody>
        ) : !notifications || notifications.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="Notifications will appear here automatically when patient events occur."
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Message</th>
                  <th className="px-5 py-3 font-medium">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[...notifications].reverse().map((n, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{n.name}</td>
                    <td className="px-5 py-3">{n.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        eventTypeColors[n.eventType] ?? 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {n.eventType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-500 max-w-xs truncate">{n.message}</td>
                    <td className="px-5 py-3 text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(n.sentAt).toLocaleString()}
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