export interface HealthStatus {
  status: string;
}

export interface Creator {
  id: string;
  email: string;
  name: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}
