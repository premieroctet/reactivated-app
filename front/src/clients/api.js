import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_HOST
});

apiClient.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "jwt_token"
    )}`;
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
