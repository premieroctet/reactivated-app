import API from './api'
import GithubAPI from './github'
import { AxiosRequestConfig } from 'axios'
import { Repository } from '../typings/entities'

export const getRepositories = () => {
  return API.get<Repository[]>(`/repositories`, {
    params: {
      sort: ['score,ASC'],
    },
  })
}

export const getRepository = (repositoryId: string) => {
  return API.get<Repository>(`/repositories/${repositoryId}`, {
    params: { join: 'pullRequests' },
  })
}

export const getRepositoryBranches = (fullName: string) => {
  return GithubAPI.get<GithubBranch[]>(`/repos/${fullName}/branches`, {
    params: { per_page: 100 },
  })
}

interface ConfigureRepoParams {
  id: Repository['id']
  data: Pick<Repository, 'branch' | 'path' | 'fullName'>
}

export const configureRepository = (params: ConfigureRepoParams) => {
  return API.put<Repository>(
    `/repositories/${params.id}/configure`,
    params.data,
  )
}

export const findRepositoriesByName = (name: string) => {
  return API.get<Repository[]>(`/repositories`, {
    params: {
      filter: `fullName||eq||${name}`,
    },
  })
}

export const recomputeDeps = (repoId: Repository['id']) => {
  return API.get(`/repositories/${repoId}/compute_deps`)
}

export const syncRepository = (fullName: string) => {
  return API.get<Repository>(`/repositories/sync/${fullName}`)
}

export const createUpgradePR = (
  fullName: string,
  data: { updatedDependencies: string[]; repoId: number },
) => {
  return API.post(`repositories/${fullName}/pulls`, data)
}

export const getPullRequests = (
  repoId: string,
  config?: AxiosRequestConfig,
) => {
  return API.get(`repositories/${repoId}/pull-requests`, config)
}

export const deleteRepository = (repoId: number) => {
  return API.delete<Repository>(`repositories/${repoId.toString()}`)
}
