interface JwTokenData {
  githubToken: string
  userId: User['id']
}

interface User {
  id: number
  username: string
  githubId: string
  githubToken: string
}

type Dependency = [string, string, string, string, DependencyType, string]

type DependencyType = 'dependencies' | 'devDependencies'

interface Repository {
  id: number
  name: string
  fullName: string
  githubId: string
  installationId: string
  author: string
  repoImg: string
  createdAt: string // Date
  dependenciesUpdatedAt: string // Date
  repoUrl: string
  user: User
  dependencies: {
    deps: Dependency[]
  } | null
  branch: string
  path?: string
}

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
