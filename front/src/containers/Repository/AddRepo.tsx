import React, { useState, useCallback, ChangeEvent } from 'react'
import {
  Button,
  Text,
  Stack,
  Box,
  IconButton,
  Flex,
  InputGroup,
  InputRightElement,
  Input,
  Icon,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import useMessageListener from '@hooks/useMessageListener'
import InstallationRepositories from '@components/InstallationRepositories'
import * as InstallationsAPI from '@api/installations'
import * as RepositoryAPI from '@api/repositories'
import RepoConfigForm from '@components/RepoConfigForm/RepoConfigForm'
import { useHistory } from 'react-router'
import { useRequest } from '@hooks/useRequest'
import useChakraToast from '@hooks/useChakraToast'
import Container from '@components/Container'

enum Step {
  PROVIDER_SELECTION = 0,
  REPO_SELECTION = 1,
  REPO_CONFIGURATION = 2,
}

interface IWrapperProps {
  onBack: () => void
  title: string
  caption?: string
}
const Wrapper: React.FC<IWrapperProps> = ({
  onBack,
  title,
  caption,
  children,
}) => {
  return (
    <Container>
      <Text fontSize="3xl">
        <IconButton
          onClick={onBack}
          aria-label="Back"
          fontSize="2xl"
          icon="chevron-left"
          mr={2}
          variant="ghost"
        />
        {title}
      </Text>

      {caption && <Text ml={10}>{caption}</Text>}

      <Box ml={10} my={8}>
        {children}
      </Box>
    </Container>
  )
}

const AddRepo = () => {
  const [step, setStep] = useState(Step.PROVIDER_SELECTION)
  const [searchTerm, setSearchTerm] = React.useState('')

  let {
    data: installations,
    revalidate: getInstallations,
    isValidating: installationsLoading,
  } = useRequest<GithubInstallation[]>(`installations`, {
    fetcher: InstallationsAPI.getUserInstallations,
    initialData: [],
    refreshInterval: 5000,
  })
  const [branches, setBranches] = useState<GithubBranch['name'][]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>()
  const history = useHistory()
  const toast = useChakraToast()

  if (searchTerm) {
    installations = installations?.map((installation) => {
      return {
        ...installation,
        repositories: installation.repositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }
    })
  }

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

  const onSelectRepo = async (fullName: string) => {
    const { data: branches } = await RepositoryAPI.getRepositoryBranches(
      fullName,
    )

    setSelectedRepo(fullName)
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
      await RepositoryAPI.setupRepository({
        data: {
          branch: data.branch,
          path: data.path || '/',
          fullName: selectedRepo!,
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
        <Wrapper
          onBack={() => {
            history.push('/')
          }}
          title="Select your provider"
          caption=" Choose the Git provider where your site’s source code is hosted."
        >
          <Button
            size="lg"
            leftIcon={FaGithub}
            onClick={onSelectGithub}
            isLoading={installationsLoading}
          >
            Github
          </Button>
        </Wrapper>
      )
    case Step.REPO_SELECTION:
      return installations && installations.length !== 0 ? (
        <Wrapper
          title="Pick your repo"
          onBack={() => {
            setStep(Step.PROVIDER_SELECTION)
          }}
        >
          <InputGroup size="md" mb={8} w={'35%'}>
            <InputRightElement>
              {searchTerm ? (
                <IconButton
                  color="gray.500"
                  aria-label="clear"
                  icon="close"
                  size="xs"
                  onClick={() => setSearchTerm('')}
                >
                  x
                </IconButton>
              ) : (
                <Icon name="search" color="gray.500" />
              )}
            </InputRightElement>
            <Input
              variant="filled"
              placeholder="Search my repo..."
              value={searchTerm}
              color="gray.500"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(event.target.value)
              }}
            ></Input>
          </InputGroup>

          <InstallationRepositories
            installations={installations}
            onSelectRepo={onSelectRepo}
          />
          <Box textAlign="center" mt={6}>
            <Text mb={4} fontSize={['md', 'lg']} textAlign="center">
              Can't find your repository/organization?
            </Text>
            <Button
              variantColor="secondary"
              leftIcon={FaGithub}
              onClick={onOpenGithub}
            >
              Add it from GitHub
            </Button>
          </Box>
        </Wrapper>
      ) : (
        <Container>
          <Stack spacing={4} mt={6} align="center">
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
        </Container>
      )
    case Step.REPO_CONFIGURATION:
      return (
        <Wrapper
          title="Configuration"
          onBack={() => {
            setStep(Step.REPO_SELECTION)
          }}
        >
          <Flex>
            <RepoConfigForm
              branches={branches}
              repoName={selectedRepo!}
              onSubmit={onSubmitRepoConfig}
            />
          </Flex>
        </Wrapper>
      )
    default:
      return null
  }
}

export default AddRepo
