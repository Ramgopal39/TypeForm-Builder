import axios from 'axios';
import { FormItem } from '@/components/dashboard/FormCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HealthResponse {
  status: string;
}

export const getHealthStatus = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};

// Form API Operations
export const getForms = async (): Promise<FormItem[]> => {
  const response = await api.get<FormItem[]>('/forms');
  return response.data;
};

export const createForm = async (title: string, description?: string): Promise<FormItem> => {
  const response = await api.post<FormItem>('/forms', { title, description });
  return response.data;
};

export const updateForm = async (
  id: number,
  data: { title?: string; description?: string; status?: string }
): Promise<FormItem> => {
  const response = await api.put<FormItem>(`/forms/${id}`, data);
  return response.data;
};

export const deleteForm = async (id: number): Promise<void> => {
  await api.delete(`/forms/${id}`);
};

export const duplicateForm = async (id: number): Promise<FormItem> => {
  const response = await api.post<FormItem>(`/forms/${id}/duplicate`);
  return response.data;
};

export const publishForm = async (id: number): Promise<FormItem> => {
  const response = await api.post<FormItem>(`/forms/${id}/publish`);
  return response.data;
};

export const unpublishForm = async (id: number): Promise<FormItem> => {
  const response = await api.post<FormItem>(`/forms/${id}/unpublish`);
  return response.data;
};
