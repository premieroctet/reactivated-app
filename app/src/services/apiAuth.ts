import apiClient from './api';

const getGithubCallback = (code: string) => {
  return apiClient.get<{ token: string }>(`app/auth/github/callback?code=${code}`);
};

export default {
  getGithubCallback,
};
