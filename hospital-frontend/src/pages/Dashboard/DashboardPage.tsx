import { useQuery } from '@tanstack/react-query'
import { Users, Receipt, Activity, UserPlus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingState from '../../components/ui/LoadingState'
import { patientService } from '../../services/patientService'
import { billingService } from '../../services/billingService'
import { analyticsService } from '../../services/analyticsService'

export default function DashboardPage() {
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getPatients,
  })

  const { data: bills, isLoading: billsLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: billingService.getBillingAccounts,
  })

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsService.getSummary,
  })

  const isLoading = patientsLoading || billsLoading || summaryLoading

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your hospital system operations and patient flow."
        actions={
          <Link to="/patients">
            <Button>
              <UserPlus size={16} />
              Add Patient
            </Button>
          </Link>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Patients"
          value={patients?.length ?? 0}
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Billing Accounts"
          value={bills?.length ?? 0}
          icon={Receipt}
          tone="success"
        />
        <StatCard
          label="Kafka Events Recorded"
          value={summary?.totalEvents ?? 0}
          icon={Activity}
          tone="warning"
        />
      </div>

      {/* Recent Patients Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Recent Patients</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Live records from the hospital database</p>
          </div>
          <Link to="/patients" className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-4">
              <LoadingState variant="skeleton-table" rows={3} />
            </div>
          ) : !patients || patients.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">
              No patients admitted yet. Click "Add Patient" to create the first record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Date of Birth</th>
                    <th className="px-5 py-3 font-medium">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {patients.slice(0, 5).map((patient) => (
                    <tr key={patient.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-3 font-medium text-neutral-900">{patient.name}</td>
                      <td className="px-5 py-3">{patient.email}</td>
                      <td className="px-5 py-3">{patient.dateOfBirth}</td>
                      <td className="px-5 py-3 text-neutral-400">{patient.registeredDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}