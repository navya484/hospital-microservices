import api from '../api/axios'

export interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registeredDate: string;
}

export interface PatientRequest {
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registeredDate?: string;
}

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/api/patients')
    return response.data
  },

  async createPatient(patient: PatientRequest): Promise<Patient> {
    const response = await api.post<Patient>('/api/patients', patient)
    return response.data
  },

  async updatePatient(id: string, patient: PatientRequest): Promise<Patient> {
    const response = await api.put<Patient>(`/api/patients/${id}`, patient)
    return response.data
  },

  async deletePatient(id: string): Promise<void> {
    await api.delete(`/api/patients/${id}`)
  }
}
