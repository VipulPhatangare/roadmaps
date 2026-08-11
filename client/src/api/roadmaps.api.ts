import apiClient from './client';

export const roadmapsApi = {
  getAll: () => apiClient.get('/roadmaps'),
  getBySlug: (slug: string) => apiClient.get(`/roadmaps/${slug}`),
  getNodeDetail: (slug: string, nodeId: string) => apiClient.get(`/roadmaps/${slug}/node/${nodeId}`),
};
