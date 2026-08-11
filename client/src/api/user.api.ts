import apiClient from './client';

export const userApi = {
  startRoadmap: (roadmapId: string) => apiClient.post(`/user/roadmaps/${roadmapId}/start`),
  getMyRoadmaps: () => apiClient.get('/user/roadmaps'),
  getProgress: (roadmapId: string) => apiClient.get(`/user/roadmaps/${roadmapId}/progress`),
  completeNode: (roadmapId: string, nodeId: string) => apiClient.post(`/user/roadmaps/${roadmapId}/node/${nodeId}/complete`),
  completeProject: (roadmapId: string, projectId: string) => apiClient.post(`/user/roadmaps/${roadmapId}/project/${projectId}/complete`),
  switchPath: (roadmapId: string, pathId: string) => apiClient.post(`/user/roadmaps/${roadmapId}/path`, { pathId }),
  getRecommendation: () => apiClient.get('/user/recommendation'),
};
