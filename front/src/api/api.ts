import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
})

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    window.localStorage.removeItem('token')
    window.location.assign('/')
  }
  return Promise.reject(error)
})

export default apiClient
