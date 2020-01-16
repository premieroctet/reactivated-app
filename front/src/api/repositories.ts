import API from './api'

const getRepositories = (userId: string) => {
  return API.get<Repository[]>(`/users/${userId}/repositories`)
}

export default { getRepositories }
