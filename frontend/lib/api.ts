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

export interface QuestionItem {
  id: number;
  form_id: number;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  position: number;
  settings?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface FormDetailResponse extends FormItem {
  questions: QuestionItem[];
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

export const getFormDetails = async (id: number): Promise<FormDetailResponse> => {
  const response = await api.get<FormDetailResponse>(`/forms/${id}`);
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

// Question API Operations
export const getFormQuestions = async (formId: number): Promise<QuestionItem[]> => {
  const response = await api.get<QuestionItem[]>(`/forms/${formId}/questions`);
  return response.data;
};

export const createQuestion = async (
  formId: number,
  data: { type: string; title: string; required?: boolean; position?: number; settings?: Record<string, any> | null }
): Promise<QuestionItem> => {
  const response = await api.post<QuestionItem>(`/forms/${formId}/questions`, data);
  return response.data;
};

export const updateQuestion = async (
  id: number,
  data: { type?: string; title?: string; description?: string; required?: boolean; position?: number; settings?: Record<string, any> | null }
): Promise<QuestionItem> => {
  const response = await api.put<QuestionItem>(`/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

export const reorderQuestions = async (
  formId: number,
  reorders: { id: number; position: number }[]
): Promise<QuestionItem[]> => {
  const response = await api.put<QuestionItem[]>(`/forms/${formId}/questions/reorder`, reorders);
  return response.data;
};
export const submitFormResponse = async (
  formId: number,
  answers: { question_id: number; value: string }[]
): Promise<any> => {
  const response = await api.post(`/public/forms/${formId}/responses`, { answers });
  return response.data;
};

export interface ResponseAnswerItem {
  id: number;
  response_id: number;
  question_id: number;
  value: string;
}

export interface FormResponseItem {
  id: number;
  form_id: number;
  submitted_at: string;
  answers: ResponseAnswerItem[];
}

export const getFormResponses = async (formId: number): Promise<FormResponseItem[]> => {
  const response = await api.get<FormResponseItem[]>(`/forms/${formId}/responses`);
  return response.data;
};
