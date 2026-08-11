import apiClient from './client';

export const authApi = {
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string }) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const domainsApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get('/domains', { params }),
  getById: (id: string) => apiClient.get(`/domains/${id}`),
  importCSV: (file?: File) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    return apiClient.post('/domains/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  generate: (id: string) => apiClient.post(`/domains/${id}/generate`),
  batchGenerate: (limit: number = 10) => apiClient.post('/domains/batch-generate', { limit }),
  getGenerationStatus: (id: string) => apiClient.get(`/domains/${id}/generation-status`),
  publish: (id: string) => apiClient.post(`/domains/${id}/publish`),
};

export const roadmapsApi = {
  getAll: () => apiClient.get('/roadmaps'),
  getBySlug: (slug: string) => apiClient.get(`/roadmaps/${slug}`),
  getNodeDetail: (slug: string, nodeId: string) => apiClient.get(`/roadmaps/${slug}/node/${nodeId}`),
};

export const userApi = {
  startRoadmap: (roadmapId: string) => apiClient.post(`/user/roadmaps/${roadmapId}/start`),
  getMyRoadmaps: () => apiClient.get('/user/roadmaps'),
  getProgress: (roadmapId: string) => apiClient.get(`/user/roadmaps/${roadmapId}/progress`),
  completeNode: (roadmapId: string, nodeId: string) =>
    apiClient.post(`/user/roadmaps/${roadmapId}/node/${nodeId}/complete`),
  completeProject: (roadmapId: string, projectId: string) =>
    apiClient.post(`/user/roadmaps/${roadmapId}/project/${projectId}/complete`),
};
