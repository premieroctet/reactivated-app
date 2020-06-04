import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { getData } from '../utils/AsyncStorage';

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
});

githubClient.interceptors.request.use(
  async (config) => {
    const code = jwt_decode<JwTokenData>((await getData('token')) || '');
    console.warn('code', code);
    if (code) {
      const githubToken = code.githubToken;
      config.headers.Authorization = `token ${githubToken}`;
      config.headers.Accept = 'application/vnd.github.machine-man-preview+json';
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default githubClient;
