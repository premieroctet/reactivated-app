import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { formatDistance } from 'date-fns'
import { Link, useRouteMatch } from 'react-router-dom'
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
import RepositoriesAPI from '@api/repositories'
import { Column } from '@components/Flex'

function RepoContent() {
  const [data, setData] = useState<Repository | null>(null)
  const [loading, setLoading] = useState(true)
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const { jwTokenData } = useAuth()
  const { userId } = jwTokenData!
  const dependencies = useMemo(() => {
    if (!data?.dependencies.deps) {
      return []
    }
    return data.dependencies.deps.filter((dep) => dep[4] === 'dependencies')
  }, [data])

  const devDependencies = useMemo(() => {
    if (!data?.dependencies.deps) {
      return []
    }
    return data.dependencies.deps.filter((dep) => dep[4] === 'devDependencies')
  }, [data])

  const loadRepository = async () => {
    setLoading(true)
    try {
      const { data } = await RepositoriesAPI.getRepository(userId, id)
      setData(data)
    } finally {
      setLoading(false)
    }
  }

  const recomputeDeps = async () => {
    await RepositoriesAPI.recomputeDeps(userId, parseInt(id, 10))
  }

  useEffect(() => {
    loadRepository()
    // eslint-disable-next-line
  }, [])

  return (
    <Column align="center" px={[4, 0]}>
      {loading ? (
        <Box color="teal.400" fontWeight="bold" fontSize={20}>
          <Heading>Chargement...</Heading>
        </Box>
      ) : (
        !!data && (
          <>
            <Stack mt={2} align="center" spacing={4}>
              <Link to="/">
                <Button
                  size="lg"
                  leftIcon={FaGithub}
                  variantColor="teal"
                  mb={4}
                >
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
                    It looks like your dependencies were not computed. This
                    might be due to an unexpected server error.
                  </AlertDescription>
                  <Button variantColor="red" onClick={recomputeDeps}>
                    Retry
                  </Button>
                </Stack>
              </Alert>
            )}
          </>
        )
      )}
    </Column>
  )
}

export default RepoContent
