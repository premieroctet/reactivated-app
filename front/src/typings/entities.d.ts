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
  createdAt: Date
  dependenciesUpdatedAt: Date

  /** URL of the repo */
  repoUrl: string
  users: string[]

  /** Package.json file of the repo */
  packageJson: object

  /** Outdated dependencies of the repo */
  dependencies: object
  branch: string
  path: string
  isConfigured: boolean
  score: number
  framework: string
  hasYarnLock: boolean
}

export interface GeneratedRepositoryBulkDto {
  bulk: Repository[]
}
