import * as RepositoriesAPI from '@api/repositories'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/core'
import Container from '@components/Container'
import DependenciesList from '@components/DependenciesList'
import LoadBar from '@components/LoadBar'
import LoadScore from '@components/LoadScore'
import RepoConfigForm from '@components/RepoConfigForm'
import useChakraToast from '@hooks/useChakraToast'
import { useAxiosRequest } from '@hooks/useRequest'
import { getDependenciesCount } from '@utils/dependencies'
import { formatDistance } from 'date-fns'
import React, { useCallback } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { mutate } from 'swr'
import FrameworkTag from '../../components/FrameworkTag/FrameworkTag'
import ViewRepoSkeleton from './ViewRepoSkeleton'
import PullRequestItem from '../../components/PullRequest/PullRequestItem'

const AlertError = () => {
  const history = useHistory()

  return (
    <Alert status="error">
      <AlertIcon />
      <Stack align="flex-start">
        <AlertDescription>Repository not found.</AlertDescription>
        <Button variantColor="red" onClick={() => history.push('/')}>
          Back to repositories list
        </Button>
      </Stack>
    </Alert>
  )
}

function ViewRepo() {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()

  const toast = useChakraToast()

  const { data, error } = useAxiosRequest<Repository>([id], {
    fetcher: RepositoriesAPI.getRepository,
    revalidateOnFocus: true,
  })

  const { data: branches, error: branchesError } = useAxiosRequest<
    GithubBranch[]
  >(`branches-${data?.githubId}`, {
    fetcher: () => RepositoriesAPI.getRepositoryBranches(data!.fullName),
    revalidateOnFocus: false,
  })

  const { data: pullRequests } = useAxiosRequest<PullRequest[]>(
    `repositories/${id}/pull-requests`,
    {
      fetcher: () =>
        RepositoriesAPI.getPullRequests(id, { params: { limit: 3 } }),
    },
  )

  const {
    isOpen: configModalOpen,
    onOpen: openConfigModal,
    onClose: closeConfigModal,
  } = useDisclosure()

  const dependencies: (Dependency | PrefixedDependency)[] = []
  const devDependencies: (Dependency | PrefixedDependency)[] = []

  data?.dependencies?.deps.forEach((dep) => {
    if (Array.isArray(dep)) {
      if (dep[4] === 'dependencies') {
        dependencies.push(dep)
      } else {
        devDependencies.push(dep)
      }
    } else {
      const prefix = Object.keys(dep)[0]
      dependencies.push({
        [prefix]: dep[prefix].filter((dep) => dep[4] === 'dependencies'),
      })
      devDependencies.push({
        [prefix]: dep[prefix].filter((dep) => dep[4] === 'devDependencies'),
      })
    }
  })

  const totalDependencies = getDependenciesCount(data?.packageJson)

  const recomputeDeps = useCallback(() => {
    return RepositoriesAPI.recomputeDeps(parseInt(id, 10))
  }, [id])

  const onUpdateConfig = async (config: { branch: string; path?: string }) => {
    try {
      const { data: configData } = await RepositoriesAPI.configureRepository({
        id: parseInt(id, 10),
        data: { ...config, fullName: data!.fullName },
      })
      mutate([id], configData)

      closeConfigModal()
      toast({
        status: 'success',
        title: 'Success !',
        description: "Successfully updated your repository's configuration",
      })
    } catch (e) {
      toast({
        title: 'An error occured',
        status: 'error',
        description: 'Please check the package.json & yarn.lock path is valid.',
      })
      throw e
    }
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Link to="/">
          <Button
            leftIcon="chevron-left"
            variant="ghost"
            variantColor="brand"
            mb={4}
          >
            Dashboard
          </Button>
        </Link>
        <Button
          leftIcon="settings"
          variant="ghost"
          variantColor="brand"
          onClick={openConfigModal}
          isDisabled={!!branchesError}
          isLoading={!branches}
        >
          Settings
        </Button>
      </Flex>

      {!data ? (
        <Container>
          <ViewRepoSkeleton />
        </Container>
      ) : (
        <>
          <Container>
            <Flex pr={10} justifyContent="space-between" my={4}>
              <LoadBar score={data.score} />
              <Stack isInline spacing={4}>
                <ChakraLink isExternal href={data.repoUrl}>
                  <Image
                    rounded={100}
                    src={data.repoImg}
                    alt={data.name}
                    size={[16, 24]}
                  />
                </ChakraLink>
                <Box backgroundColor="yellow">
                  <Heading fontSize="2xl">{data.name}</Heading>

                  <Text
                    mb={2}
                    fontSize="sm"
                    display="flex"
                    justifyContent="space-between"
                  >
                    {data?.framework !== null && (
                      <FrameworkTag framework={data.framework} />
                    )}
                  </Text>

                  <ChakraLink
                    borderTop="1px dashed"
                    borderTopColor="gray.300"
                    pt={2}
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    isExternal
                    href={`https://github.com/${data.fullName}`}
                  >
                    <Box as={FaGithub} mr={1} /> {data.fullName}
                  </ChakraLink>
                </Box>
              </Stack>
              <LoadScore score={data.score} />
            </Flex>
          </Container>

          <Container py={3}>
            <Heading mt={10} as="h3" fontSize="xl">
              Outdated Dependencies
            </Heading>
            {data?.score !== null && totalDependencies !== null && (
              <>
                <Text fontSize="xs">
                  Refreshed{' '}
                  {formatDistance(
                    new Date(data.dependenciesUpdatedAt),
                    new Date(),
                  )}{' '}
                  ago
                </Text>
                <Text as="small" color={'red.500'} display="inline">
                  {dependencies.length + devDependencies.length} (outdated)
                </Text>
                <Text as="small" display="inline">
                  {' '}
                  / {totalDependencies} libraries
                </Text>
              </>
            )}

            {/* Pull Requests list */}
            {pullRequests && pullRequests.length > 0 && (
              <>
                <Heading mt={10} as="h3" fontSize="xl">
                  Pull Requests
                </Heading>
                <Box w="100%" py={4}>
                  {pullRequests.map((pullRequest) => (
                    <PullRequestItem pullRequest={pullRequest} />
                  ))}
                </Box>
              </>
            )}

            {data.dependencies && data.dependencies.deps && (
              <Box w={['100%', 'unset']} minW={['100%']} mt={4}>
                <Tabs
                  defaultIndex={dependencies.length === 0 ? 1 : 0}
                  isFitted
                  variant="enclosed"
                >
                  <TabList>
                    <Tab
                      _selected={{ bg: 'secondary.500', color: 'white' }}
                      disabled={dependencies.length === 0}
                    >
                      Dependencies
                    </Tab>
                    <Tab
                      _selected={{ bg: 'secondary.500', color: 'white' }}
                      disabled={devDependencies.length === 0}
                    >
                      Dev Dependencies{' '}
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <DependenciesList
                        dependencies={dependencies}
                        repo={data}
                      />
                    </TabPanel>
                    <TabPanel>
                      <DependenciesList
                        isDev
                        dependencies={devDependencies}
                        repo={data}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            )}
            {!data.dependencies && (
              <Alert status="info" mt={6}>
                <AlertIcon />
                <Stack align="flex-start">
                  <AlertDescription>
                    It looks like your dependencies were not computed. This
                    might be due to an unexpected server error.
                  </AlertDescription>
                  <Button onClick={recomputeDeps}>Retry</Button>
                </Stack>
              </Alert>
            )}
          </Container>
        </>
      )}

      {error && <AlertError />}
      {data && (
        <Modal
          isOpen={configModalOpen}
          onClose={closeConfigModal}
          isCentered
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent pb={4} rounded={10}>
            <ModalHeader>Update repository configuration</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RepoConfigForm
                repoName={data.fullName}
                initialBranch={data.branch}
                initialPath={data.path}
                onSubmit={onUpdateConfig}
                branches={branches?.map((branch) => branch.name) || []}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default ViewRepo
