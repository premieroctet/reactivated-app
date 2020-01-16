interface JwTokenData {
  githubToken: string
  userId: string
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
  repoUrl: string
  user: User
  dependencies: {
    deps: Dependency[]
  }
}
