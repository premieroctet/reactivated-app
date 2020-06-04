import axios from 'axios';
import { Config } from '../config';
import { getData, storeData } from '../utils/AsyncStorage';
import { useNavigation } from '@react-navigation/native';

const apiClient = axios.create({
  baseURL: Config.API_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${await getData('token')}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    console.warn('error.response.status', error.response.data);
    const navigation = useNavigation();
    storeData('token', '');
    navigation.navigate('Home');
  }
  return Promise.reject(error);
});

export default apiClient;
