import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Receipt,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  RefreshCw,
  Filter,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody, CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { billingService } from '../../services/billingService'

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED'>('ALL')

  const {
    data: bills,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['billing'],
    queryFn: billingService.getBillingAccounts,
    refetchInterval: 15_000,
  })

  // KPI Metrics
  const metrics = useMemo(() => {
    if (!bills) return { total: 0, active: 0, pending: 0, totalBalance: 0 }
    const total = bills.length
    const active = bills.filter((b) => b.status === 'ACTIVE').length
    const pending = bills.filter((b) => b.status === 'PENDING').length
    const totalBalance = bills.reduce((acc, b) => acc + (b.balance || 0), 0)
    return { total, active, pending, totalBalance }
  }, [bills])

  // Filtered accounts
  const filteredBills = useMemo(() => {
    if (!bills) return []
    return bills.filter((bill) => {
      const matchesSearch =
        bill.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || bill.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bills, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Accounts"
        description="Monitor automated patient billing accounts generated via gRPC."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </Button>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Accounts"
          value={metrics.total}
          icon={Receipt}
          tone="primary"
        />
        <StatCard
          label="Active Accounts"
          value={metrics.active}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Pending Accounts"
          value={metrics.pending}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Total Balance Due"
          value={`$${metrics.totalBalance.toFixed(2)}`}
          icon={DollarSign}
          tone="secondary"
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by Account ID or Patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-sm rounded-md border border-neutral-300 px-3 py-2 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="CLOSED">Closed</option>
            </select>
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
              title="Failed to load billing accounts"
            />
          </CardBody>
        ) : !bills || bills.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={Receipt}
              title="No billing accounts found"
              description="Billing accounts are automatically provisioned via gRPC when a patient is admitted."
            />
          </CardBody>
        ) : filteredBills.length === 0 ? (
          <CardBody>
            <div className="p-8 text-center text-sm text-neutral-500">
              No billing accounts match your filter criteria.
            </div>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Account ID</th>
                  <th className="px-5 py-3 font-medium">Patient ID</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.accountId} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-neutral-900">
                      {bill.accountId}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                      {bill.patientId}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bill.status === 'ACTIVE'
                            ? 'bg-success-100 text-success-800'
                            : bill.status === 'PENDING'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-neutral-900">
                      ${bill.balance.toFixed(2)}
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