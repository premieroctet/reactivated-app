import axios from 'axios';
import { Config } from '../config';
import { useNavigation } from '@react-navigation/native';

const apiClient = axios.create({
  baseURL: Config.API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    // const navigation = useNavigation();
    window.localStorage.removeItem('token');
    // navigation.navigate('Home');
  }
  return Promise.reject(error);
});

export default apiClient;
