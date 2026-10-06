import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card, { CardBody } from '../../components/ui/Card'
import LoadingState from '../../components/ui/LoadingState'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Input from '../../components/ui/Input'
import { useToast } from '../../context/ToastContext'
import { patientService, Patient, PatientRequest } from '../../services/patientService'

export default function PatientsPage() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: patients, isLoading, isError, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getPatients,
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)

  const [formData, setFormData] = useState<PatientRequest>({
    name: '',
    email: '',
    address: '',
    dateOfBirth: '',
    registeredDate: new Date().toISOString().split('T')[0]
  })

  const createMutation = useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      showToast('success', 'Patient created successfully')
      closeForm()
    },
    onError: () => {
      showToast('error', 'Failed to create patient')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: PatientRequest }) => patientService.updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      showToast('success', 'Patient updated successfully')
      closeForm()
    },
    onError: () => {
      showToast('error', 'Failed to update patient')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: patientService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      showToast('success', 'Patient deleted successfully')
      setIsDeleteOpen(false)
      setPatientToDelete(null)
    },
    onError: () => {
      showToast('error', 'Failed to delete patient')
    }
  })

  const handleOpenForm = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({
        name: patient.name,
        email: patient.email,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,
        registeredDate: patient.registeredDate
      })
    } else {
      setEditingPatient(null)
      setFormData({
        name: '',
        email: '',
        address: '',
        dateOfBirth: '',
        registeredDate: new Date().toISOString().split('T')[0]
      })
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPatient(null)
  }

  const handleFormSubmit = () => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const confirmDelete = (patient: Patient) => {
    setPatientToDelete(patient)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patients" 
        description="Manage hospital patients and their records."
        actions={
          <Button onClick={() => handleOpenForm()} icon={Plus}>
            Add Patient
          </Button>
        }
      />
      
      <Card>
        {isLoading ? (
          <CardBody><LoadingState variant="skeleton-table" rows={4} /></CardBody>
        ) : isError ? (
          <CardBody><ErrorState onRetry={() => refetch()} title="Failed to load patients" /></CardBody>
        ) : !patients || patients.length === 0 ? (
          <CardBody>
            <EmptyState 
              icon={Users} 
              title="No patients found" 
              description="Get started by adding a new patient."
              action={<Button onClick={() => handleOpenForm()}>Add Patient</Button>}
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Date of Birth</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{patient.name}</td>
                    <td className="px-5 py-3">{patient.email}</td>
                    <td className="px-5 py-3">{patient.address}</td>
                    <td className="px-5 py-3">{patient.dateOfBirth}</td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenForm(patient)} 
                        className="p-1 text-neutral-400 hover:text-primary-600 transition-colors"
                        aria-label="Edit patient"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(patient)}
                        className="p-1 text-neutral-400 hover:text-error-600 transition-colors"
                        aria-label="Delete patient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        title={editingPatient ? 'Edit Patient' : 'Add Patient'}
        footer={
          <>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button 
              onClick={handleFormSubmit} 
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingPatient ? 'Save Changes' : 'Add Patient'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
          />
          <Input 
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
          />
          <Input 
            label="Address"
            placeholder="123 Health St, City"
            value={formData.address}
            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
          />
          <Input 
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))}
          />
          {!editingPatient && (
            <Input 
              label="Registration Date"
              type="date"
              value={formData.registeredDate}
              onChange={(e) => setFormData(p => ({ ...p, registeredDate: e.target.value }))}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Patient"
        description={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (patientToDelete) deleteMutation.mutate(patientToDelete.id)
        }}
      />
    </div>
  )
}