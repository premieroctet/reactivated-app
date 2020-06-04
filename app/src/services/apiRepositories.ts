import githubClient from './apiGithub';
import apiClient from './api';

export const getRepositories = () => {
  return apiClient.get<Repository[]>(`/repositories`, {
    params: {
      filter: 'isConfigured||eq||true',
    },
  });
};
