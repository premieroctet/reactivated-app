import React, { useMemo, useCallback } from 'react'
import { formatDistance } from 'date-fns'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import DependenciesList from '@components/DependenciesList'
import {
  Button,
  Box,
  Heading,
  Link as ChakraLink,
  Image,
  Text,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import * as RepositoriesAPI from '@api/repositories'
import { Column } from '@components/Flex'
import { useAxiosRequest } from '@hooks/useRequest'

function RepoContent() {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const history = useHistory()
  const { data, error } = useAxiosRequest<Repository>([id], {
    fetcher: RepositoriesAPI.getRepository,
  })

  const dependencies = useMemo(() => {
    if (!data?.dependencies?.deps) {
      return []
    }
    return data.dependencies.deps.filter((dep) => dep[4] === 'dependencies')
  }, [data])

  const devDependencies = useMemo(() => {
    if (!data?.dependencies?.deps) {
      return []
    }
    return data.dependencies.deps.filter((dep) => dep[4] === 'devDependencies')
  }, [data])

  const recomputeDeps = () => {
    return RepositoriesAPI.recomputeDeps(parseInt(id, 10))
  }

  const renderLoading = useCallback(() => {
    return (
      <Box color="teal.400" fontWeight="bold" fontSize={20}>
        <Heading>Chargement...</Heading>
      </Box>
    )
  }, [])

  const renderData = useCallback(() => {
    if (!data) {
      return null
    }

    return (
      <>
        <Stack mt={2} align="center" spacing={4}>
          <Link to="/">
            <Button size="lg" leftIcon={FaGithub} variantColor="teal" mb={4}>
              Return to repo list
            </Button>
          </Link>

          <ChakraLink href={data.repoUrl}>
            <Image
              rounded="md"
              src={data.repoImg}
              alt="repo-icon"
              size={[16, 24]}
            />
          </ChakraLink>
          <Box border="1px solid" borderColor="teal.300" px={20} py={2}>
            <Heading fontSize={20}>{data.name}</Heading>
          </Box>

          <Text fontSize={17}>
            by <b>{data.author}</b>
          </Text>
          <Text>
            <Text as="span" role="img" aria-label="light">
              ⏱
            </Text>{' '}
            {formatDistance(new Date(data.createdAt), new Date())} ago
          </Text>
        </Stack>

        {data.dependencies && data.dependencies.deps && (
          <Box w={['100%', 'unset']} minW={['100%']} mt={6}>
            <Tabs
              defaultIndex={dependencies.length === 0 ? 1 : 0}
              isFitted
              variant="soft-rounded"
            >
              <TabList>
                <Tab
                  _selected={{ bg: 'teal.500', color: 'white' }}
                  disabled={dependencies.length === 0}
                >
                  Dependencies
                </Tab>
                <Tab
                  _selected={{ bg: 'teal.500', color: 'white' }}
                  disabled={devDependencies.length === 0}
                >
                  Dev Dependencies
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <DependenciesList dependencies={dependencies} />
                </TabPanel>
                <TabPanel>
                  <DependenciesList dependencies={devDependencies} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
        {!data.dependencies && (
          <Alert status="error" mt={6}>
            <AlertIcon />
            <Stack align="flex-start">
              <AlertDescription>
                It looks like your dependencies were not computed. This might be
                due to an unexpected server error.
              </AlertDescription>
              <Button variantColor="red" onClick={recomputeDeps}>
                Retry
              </Button>
            </Stack>
          </Alert>
        )}
      </>
    )
  }, [data, dependencies, devDependencies, recomputeDeps])

  const renderError = useCallback(() => {
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
  }, [history])

  return (
    <Column align="center" px={[4, 0]}>
      {!data && renderLoading()}
      {!!data && renderData()}
      {error && renderError()}
    </Column>
  )
}

export default RepoContent
