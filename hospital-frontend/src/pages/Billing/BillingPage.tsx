import { useQuery } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardBody } from '../../components/ui/Card'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import { billingService } from '../../services/billingService'

export default function BillingPage() {
  const { data: bills, isLoading, isError, refetch } = useQuery({
    queryKey: ['billing'],
    queryFn: billingService.getBillingAccounts,
  })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Billing & Accounts" 
        description="View and manage patient billing accounts."
      />
      
      <Card>
        {isLoading ? (
          <CardBody><LoadingState variant="skeleton-table" rows={4} /></CardBody>
        ) : isError ? (
          <CardBody><ErrorState onRetry={() => refetch()} title="Failed to load billing accounts" /></CardBody>
        ) : !bills || bills.length === 0 ? (
          <CardBody>
            <EmptyState 
              icon={Receipt} 
              title="No billing accounts found" 
              description="Billing accounts are automatically created when a patient is registered."
            />
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
                {bills.map((bill) => (
                  <tr key={bill.accountId} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{bill.accountId}</td>
                    <td className="px-5 py-3">{bill.patientId}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.status === 'ACTIVE' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
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