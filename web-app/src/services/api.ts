import axios from 'axios';
import { Config } from '../constants/config';
import { PredictionResponse } from '../types';

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiService = {
  async getPrediction(sequence: number[][]): Promise<PredictionResponse> {
    const response = await api.post<PredictionResponse>('/predict', {
      sequence,
    });
    return response.data;
  },

  async getMetrics(): Promise<string> {
    const response = await api.get<string>('/metrics');
    return response.data;
  },

  async login(email: string, password: string) {
    return { token: 'mock-token', user: { email } };
  },

  async signup(email: string, password: string) {
    return { token: 'mock-token', user: { email } };
  },

  async updateProfile(userId: string, data: any) {
    return { success: true };
  },

  async getMedications(userId: string) {
    return [];
  },

  async addMedication(userId: string, medication: any) {
    return { success: true, id: Date.now().toString() };
  },
};

export default ApiService;
