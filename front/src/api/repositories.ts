import API from './api'
import GithubAPI from './github'

const getRepositories = (userId: User['id']) => {
  return API.get<Repository[]>(`/users/${userId}/repositories`)
}

const getRepository = (userId: User['id'], repositoryId: string) => {
  return API.get<Repository>(`/users/${userId}/repositories/${repositoryId}`)
}

const getRepositoryBranches = (fullName: string) => {
  return GithubAPI.get<GithubBranch[]>(`/repos/${fullName}/branches`)
}

interface UpdateRepoParams {
  id: Repository['id']
  userId: User['id']
  data: Partial<Repository>
}

const configureRepository = (params: UpdateRepoParams) => {
  return API.put<Repository>(
    `/users/${params.userId}/repositories/${params.id}/configure`,
    params.data,
  )
}

const findRepositoryByName = (userId: User['id'], name: string) => {
  return API.get<Repository[]>(`/users/${userId}/repositories`, {
    params: {
      s: JSON.stringify({ fullName: name }),
    },
  })
}

const recomputeDeps = (userId: User['id'], repoId: Repository['id']) => {
  return API.get(`/users/${userId}/repositories/${repoId}/compute_deps`)
}

export default {
  getRepositories,
  getRepository,
  getRepositoryBranches,
  configureRepository,
  findRepositoryByName,
  recomputeDeps,
}
