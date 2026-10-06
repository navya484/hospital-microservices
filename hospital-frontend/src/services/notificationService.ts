import api from '../api/axios'

export interface NotificationRecord {
  patientId: string;
  name: string;
  email: string;
  eventType: string;
  message: string;
  sentAt: number;
}

export const notificationService = {
  async getNotifications(): Promise<NotificationRecord[]> {
    const response = await api.get<NotificationRecord[]>('/api/notifications')
    return response.data
  }
}
