import React, { useState, useCallback } from 'react'
import { Button, Text, Stack, Heading } from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import { Column } from '@components/Flex'
import useMessageListener from '@hooks/useMessageListener'
import InstallationRepositories from '@components/InstallationRepositories'
import * as InstallationsAPI from '@api/installations'
import * as RepositoryAPI from '@api/repositories'
import RepoConfigForm from '@components/RepoConfigForm/RepoConfigForm'
import { useHistory } from 'react-router'
import { useRequest } from '@hooks/useRequest'
import useChakraToast from '@hooks/useChakraToast'

enum Step {
  PROVIDER_SELECTION = 0,
  REPO_SELECTION = 1,
  REPO_CONFIGURATION = 2,
}

const AddRepo = () => {
  const [step, setStep] = useState(Step.PROVIDER_SELECTION)
  const {
    data: installations,
    revalidate: getInstallations,
    isValidating: installationsLoading,
  } = useRequest<GithubInstallation[]>('installations', {
    fetcher: InstallationsAPI.getUserInstallations,
    initialData: [],
    revalidateOnFocus: false,
  })
  const [branches, setBranches] = useState<GithubBranch['name'][]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const history = useHistory()
  const toast = useChakraToast()

  const onOpenGithub = () => {
    const win = window.open(
      `https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`,
      'Add repositories',
      'height=640,width=960,toolbar=no,menubar=no,scrollbars=yes,location=no,status=no',
    )

    return win
  }

  const onMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data === 'installation-made') {
        getInstallations()
      }
    },
    [getInstallations],
  )

  useMessageListener(onMessage)

  const onSelectRepo = async (repo: GithubInstallationRepository) => {
    const { data: repositories } = await RepositoryAPI.findRepositoriesByName(
      repo.fullName,
    )
    const { data: branches } = await RepositoryAPI.getRepositoryBranches(
      repo.fullName,
    )

    if (repositories.length === 0) {
      // Repo has been deleted in our db, we have to recover it
      const { data: repository } = await RepositoryAPI.syncRepository(
        repo.fullName,
      )

      setSelectedRepo(repository)
    } else {
      setSelectedRepo(repositories[0])
    }

    setBranches(branches.map((branch) => branch.name))
    setStep(Step.REPO_CONFIGURATION)
  }

  const onSelectGithub = async () => {
    await getInstallations()
    setStep(Step.REPO_SELECTION)
  }

  const onSubmitRepoConfig = async (data: {
    branch: string
    path?: string
  }) => {
    try {
      await RepositoryAPI.configureRepository({
        id: selectedRepo!.id,
        data: {
          branch: data.branch,
          path: data.path,
          fullName: selectedRepo!.fullName,
        },
      })
      history.push('/')
    } catch (e) {
      toast({
        title: 'An error occured',
        status: 'error',
        description: 'Please check the package.json & yarn.lock path is valid.',
      })
    }
  }

  switch (step) {
    case Step.PROVIDER_SELECTION:
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
    case Step.REPO_SELECTION:
      return installations && installations.length !== 0 ? (
        <Column align="center">
          <InstallationRepositories
            installations={installations}
            onSelectRepo={onSelectRepo}
          />
          <Stack spacing={4} mt={6}>
            <Text fontSize={['md', 'lg']} textAlign="center">
              Can't find your repository ?
            </Text>
            <Button
              variantColor="teal"
              size="lg"
              leftIcon={FaGithub}
              onClick={onOpenGithub}
            >
              Add it from GitHub
            </Button>
          </Stack>
        </Column>
      ) : (
        <Stack spacing={4} mt={6}>
          <Text fontSize={['md', 'lg']} textAlign="center">
            It seems you have no repository configured.
          </Text>
          <Button
            variantColor="teal"
            size="lg"
            leftIcon={FaGithub}
            onClick={onOpenGithub}
          >
            Configure on GitHub
          </Button>
        </Stack>
      )
    case Step.REPO_CONFIGURATION:
      return (
        <Column align="flex-start">
          <Heading as="h2">Repo config</Heading>
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

export default AddRepo
