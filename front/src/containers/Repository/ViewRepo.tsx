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
import DependenciesList from '@components/DependenciesList'
import { Column } from '@components/Flex'
import HealthBar from '@components/HealthBar/HealthBar'
import RepoConfigForm from '@components/RepoConfigForm'
import useChakraToast from '@hooks/useChakraToast'
import { useAxiosRequest } from '@hooks/useRequest'
import { getDependenciesCount } from '@utils/dependencies'
import { formatDistance } from 'date-fns'
import React, { useCallback } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { mutate } from 'swr'
import FrameworkTag from '../../components/FrameworkTag/FrameworkTag'
import ViewRepoSkeleton from './ViewRepoSkeleton'

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
      <Column px={[4, 0]}>
        {!data ? (
          <ViewRepoSkeleton />
        ) : (
          <>
            <Flex justifyContent="space-between">
              <Link to="/">
                <Button
                  leftIcon="chevron-left"
                  variant="ghost"
                  variantColor="gray"
                  mb={4}
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                leftIcon="settings"
                variantColor="gray"
                variant="ghost"
                onClick={openConfigModal}
                isDisabled={!!branchesError}
                isLoading={!branches}
              >
                Settings
              </Button>
            </Flex>

            <Stack isInline spacing={4} my={4}>
              <ChakraLink isExternal href={data.repoUrl}>
                <Image
                  rounded="lg"
                  src={data.repoImg}
                  alt={data.name}
                  size={[16, 24]}
                />
              </ChakraLink>
              <Box backgroundColor="yellow">
                <Heading fontSize="2xl">{data.name}</Heading>
                <Text
                  mb={4}
                  fontSize="sm"
                  display="flex"
                  justifyContent="space-between"
                >
                  <b>@{data.author}</b>
                  {data?.framework !== null && (
                    <FrameworkTag framework={data.framework} />
                  )}
                </Text>

                {data?.score !== null && totalDependencies !== null && (
                  <>
                    <HealthBar score={data.score} />
                    <Text as="small" color={'red.500'} display="inline">
                      {dependencies.length + devDependencies.length} (outdated)
                    </Text>
                    <Text as="small" display="inline">
                      {' '}
                      / {totalDependencies} libraries
                    </Text>
                  </>
                )}
              </Box>
              <Flex alignItems="center" justifyContent="center" flex="1"></Flex>
            </Stack>

            <Heading mt={10} as="h3" fontSize="xl">
              Outdated Dependencies
            </Heading>
            <Text fontSize="xs">
              Refreshed{' '}
              {formatDistance(new Date(data.dependenciesUpdatedAt), new Date())}{' '}
              ago
            </Text>

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
      </Column>
    </>
  )
}

export default ViewRepo
