/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** Id of the object */
  id: number
  username: string
  githubId: string
  githubToken: string
}

export interface GeneratedUserBulkDto {
  bulk: User[]
}

export interface Date {}

export interface Repository {
  /** Id of the object */
  id: number

  /** Name of the repo */
  name: string
  fullName: string
  githubId: string
  installationId: string

  /** Author of the repo */
  author: string

  /** Image of the repo */
  repoImg: string

  /** Create date of the repo */
  createdAt: string
  dependenciesUpdatedAt: string

  /** URL of the repo */
  repoUrl: string
  users: User[]

  /** Package.json file of the repo */
  packageJson: PackageJson

  /** Outdated dependencies of the repo */
  dependencies: {
    deps: (DependencyArray | PrefixedDependency)[]
  } | null
  branch: string
  path: string
  isConfigured: boolean
  score: number
  framework: FrameworkTag
  hasYarnLock: boolean
  pullRequests: PullRequest[]

  crawlError: string
}

export interface PullRequest {
  /** Id of the object */
  id: number
  status: string
  repository: Repository
  branchName: string
  url: string
}

export interface GeneratedRepositoryBulkDto {
  bulk: Repository[]
}
