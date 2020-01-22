import React, { useState, useCallback } from 'react'
import { Button } from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import { Column } from '@components/Flex'
import useMessageListener from '@hooks/useMessageListener'
import InstallationRepositories from '@components/InstallationRepositories'
import InstallationsAPI from '@api/installations'
import RepositoryAPI from '@api/repositories'
import RepoConfigForm from '@components/RepoConfigForm/RepoConfigForm'
import { useAuth } from '@contexts/AuthContext'
import { useHistory } from 'react-router'

const AddRepository = () => {
  const { jwTokenData } = useAuth()
  const [step, setStep] = useState(0)
  const [installations, setInstallations] = useState<GithubInstallation[]>([])
  const [branches, setBranches] = useState<GithubBranch['name'][]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [installationsLoading, setInstallationsLoading] = useState(false)
  const history = useHistory()

  const onOpenGithub = () => {
    const win = window.open(
      `https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`,
      'Add repositories',
      'height=640,width=960,toolbar=no,menubar=no,scrollbars=no,location=no,status=no',
    )

    return win
  }

  const getInstallations = async () => {
    const installations = await InstallationsAPI.getUserInstallations()

    setInstallations(installations)
  }

  const onMessage = useCallback((e: MessageEvent) => {
    if (e.data === 'installation-made') {
      getInstallations()
    }
  }, [])

  useMessageListener(onMessage)

  const onSelectRepo = async (repo: GithubInstallationRepository) => {
    const { data: branches } = await RepositoryAPI.getRepositoryBranches(
      repo.fullName,
    )
    const { data: repository } = await RepositoryAPI.findRepositoryByName(
      jwTokenData!.userId,
      repo.fullName,
    )

    setSelectedRepo(repository[0])
    setBranches(branches.map((branch) => branch.name))
    setStep(2)
  }

  const onSelectGithub = async () => {
    setInstallationsLoading(true)
    try {
      await getInstallations()
      setStep(1)
    } finally {
      setInstallationsLoading(false)
    }
  }

  const onSubmitRepoConfig = async (data: {
    branch: string
    path?: string
  }) => {
    await RepositoryAPI.configureRepository({
      id: selectedRepo!.id,
      userId: jwTokenData!.userId,
      data: {
        branch: data.branch,
        path: data.path,
      },
    })
    history.push('/')
  }

  switch (step) {
    case 0:
      return (
        <Column align="center">
          <Button
            variantColor="teal"
            size="lg"
            leftIcon={FaGithub}
            onClick={onSelectGithub}
            isLoading={installationsLoading}
          >
            Github
          </Button>
        </Column>
      )
    case 1:
      return installations.length !== 0 ? (
        <Column align="center">
          <InstallationRepositories
            installations={installations}
            onSelectRepo={onSelectRepo}
          />
          <Button
            variantColor="teal"
            size="lg"
            leftIcon={FaGithub}
            onClick={onOpenGithub}
            mt={6}
          >
            Add from GitHub
          </Button>
        </Column>
      ) : null
    case 2:
      return (
        <Column align="flex-start">
          <RepoConfigForm
            branches={branches}
            repoName={selectedRepo!.fullName}
            onSubmit={onSubmitRepoConfig}
          />
        </Column>
      )
    default:
      return null
  }
}

export default AddRepository
