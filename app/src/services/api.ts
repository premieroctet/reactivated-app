import axios from 'axios';
import { Config } from '../config';
import { getData } from '../utils/AsyncStorage';

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
    console.error('error.response.status', error.response.status);
    // const navigation = useNavigation();
    // storeData('token', '');
    // navigation.navigate('Home');
  }
  return Promise.reject(error);
});

export default apiClient;
