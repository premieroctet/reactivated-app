import API from './api'

const getRepositories = (userId: string) => {
  return API.get<Repository[]>(`/users/${userId}/repositories`)
}

const getRepository = (userId: string, repositoryId: string) => {
  return API.get<Repository>(`/users/${userId}/repositories/${repositoryId}`)
}

export default { getRepositories, getRepository }
