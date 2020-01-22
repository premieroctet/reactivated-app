import GithubAPI from './github'

type Installations = {
  installations: Array<{
    id: number
    account: {
      login: string
      avatar_url: string
      id: string
    }
  }>
}

type InstallationRepositories = {
  repositories: Array<{
    id: number
    name: string
    full_name: string
    private: boolean
  }>
}

const getUserInstallations = async (): Promise<GithubInstallation[]> => {
  const { data: installationsData } = await GithubAPI.get<Installations>(
    '/user/installations',
  )

  const installations = installationsData.installations

  const repositories = await Promise.all(
    installations.map((installation) => {
      return GithubAPI.get<InstallationRepositories>(
        `/user/installations/${installation.id}/repositories`,
      ).then((res) => res.data)
    }),
  )

  return installations.map<GithubInstallation>((installation, idx) => {
    return {
      id: installation.id,
      owner: {
        avatarUrl: installation.account.avatar_url,
        login: installation.account.login,
        id: installation.account.id,
      },
      repositories: repositories[idx].repositories.map<
        GithubInstallationRepository
      >((repository) => {
        return {
          id: repository.id,
          fullName: repository.full_name,
          name: repository.name,
          private: repository.private,
        }
      }),
    }
  })
}

export default { getUserInstallations }
