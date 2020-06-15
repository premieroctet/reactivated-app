interface JwTokenData {
  githubToken: string
  githubId: string
  userName: string
  userId: User['id']
  validated: boolean
}

type DependencyArray = [string, string, string, string, DependencyType, string]
type Dependency = {
  name: string
  current: string
  wanted: string
  latest: string
  type: DependencyType
  url: string
  prefix?: string
}

type PrefixedDependency = { [prefix: string]: DependencyArray[] }

type DependencyType = 'dependencies' | 'devDependencies'

type PackageJson = {
  dependencies: object
  devDependencies: object
} | null

type FrameworkTag =
  | 'react'
  | 'react native'
  | 'vue'
  | 'angular'
  | 'next.js'
  | 'nest.js'
  | 'express'

interface GithubAccount {
  login: string
  avatarUrl: string
  id: string
}

interface GithubInstallationRepository {
  id: number
  name: string
  fullName: string
  private: boolean
}

interface GithubInstallation {
  id: number
  owner: GithubAccount
  repositories: GithubInstallationRepository[]
}

interface GithubBranch {
  name: string
}

type Status = 'pending' | 'done' | 'merged' | 'closed'
