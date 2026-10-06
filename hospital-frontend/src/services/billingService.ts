import api from '../api/axios'

export interface BillingAccount {
  accountId: string;
  patientId: string;
  status: string;
  balance: number;
}

export const billingService = {
  async getBillingAccounts(): Promise<BillingAccount[]> {
    const response = await api.get<BillingAccount[]>('/api/billing')
    return response.data
  }
}
