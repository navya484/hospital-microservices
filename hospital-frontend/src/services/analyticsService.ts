import api from '../api/axios'

export interface PatientEventRecord {
  patientId: string;
  name: string;
  email: string;
  eventType: string;
  receivedAt: number;
}

export interface AnalyticsSummary {
  totalEvents: number;
  registered: number;
  updated: number;
  deleted: number;
}

export const analyticsService = {
  async getEvents(): Promise<PatientEventRecord[]> {
    const response = await api.get<PatientEventRecord[]>('/api/analytics/events')
    return response.data
  },

  async getSummary(): Promise<AnalyticsSummary> {
    const response = await api.get<AnalyticsSummary>('/api/analytics/summary')
    return response.data
  }
}
