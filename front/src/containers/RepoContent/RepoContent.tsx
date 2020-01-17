import React, { useEffect, useState } from 'react'
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

  const loadRepository = async () => {
    setLoading(true)
    try {
      const { data } = await RepositoriesAPI.getRepository(userId, id)
      setData(data)
    } finally {
      setLoading(false)
    }
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
            <Link to="/">
              <Button size="lg" leftIcon={FaGithub} variantColor="teal">
                Return to repo list
              </Button>
            </Link>

            <Column mt={2} align="center">
              <ChakraLink href={data.repoUrl}>
                <Image
                  rounded="md"
                  src={data.repoImg}
                  alt="repo-icon"
                  size={[16, 24]}
                  mt={4}
                />
              </ChakraLink>
              <Box
                mt={4}
                border="1px solid"
                borderColor="teal.300"
                px={20}
                py={2}
              >
                <Heading fontSize={20}>{data.name}</Heading>
              </Box>

              <Text fontSize={17} mt={2}>
                by <b>{data.author}</b>
              </Text>
              <Text mt={2}>
                <Text as="span" role="img" aria-label="light">
                  ⏱
                </Text>{' '}
                {formatDistance(new Date(data.createdAt), new Date())} ago
              </Text>
            </Column>

            {data.dependencies && data.dependencies.deps && (
              <Box w={['100%', 'unset']} minW={['100%', '40%']} mt={6}>
                <Tabs isFitted variant="soft-rounded">
                  <TabList>
                    <Tab _selected={{ bg: 'teal.500', color: 'white' }}>
                      Dependencies
                    </Tab>
                    <Tab _selected={{ bg: 'teal.500', color: 'white' }}>
                      Dev Dependencies
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <DependenciesList
                        dependencies={data.dependencies.deps.filter(
                          (dep) => dep[4] === 'dependencies',
                        )}
                      />
                    </TabPanel>
                    <TabPanel>
                      <DependenciesList
                        dependencies={data.dependencies.deps.filter(
                          (dep) => dep[4] === 'devDependencies',
                        )}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            )}
          </>
        )
      )}
    </Column>
  )
}

export default RepoContent
