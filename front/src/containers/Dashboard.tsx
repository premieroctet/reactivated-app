import React from 'react'
import { Text, Flex, Badge, Box, Image } from '@chakra-ui/core'
import * as RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { useAxiosRequest } from '@hooks/useRequest'
import { Repository } from '../typings/entities'
import Container from '@components/Container'
import DashboardSkeleton from './DashboardSkeleton'
import FirstAppButton from '@components/FirstAppButton'

export const getMaxRepositories = () => {
  return parseInt(process.env.REACT_APP_MAX_REPOS || '5', 10)
}

const Home = () => {
  let { data: repositories } = useAxiosRequest<Repository[]>('/repositories', {
    fetcher: RepositoriesAPI.getRepositories,
    refreshInterval: 6000,
  })

  if (!repositories) {
    return <DashboardSkeleton />
  }

  repositories = repositories.sort((repo1, repo2) => {
    if (!repo1.isConfigured) {
      return 1
    } else {
      if (repo1.isConfigured && repo2.isConfigured) {
        return repo1.score - repo2.score
      }
      return -1
    }
  })

  return (
    <>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl">
            My Reactivated <b>apps</b>{' '}
            <Badge variantColor="brand" fontSize="sm">
              {repositories.length}/{getMaxRepositories()}
            </Badge>
          </Text>
        </Flex>
      </Container>

      <Flex flexDirection={['column-reverse', 'column-reverse', 'row']}>
        <Box flex="1">
          <RepositoriesList repositories={repositories} />
        </Box>

        <Box flex="1">
          {repositories.length === 0 ? (
            <Flex my={10} direction="column" alignItems="center">
              <FirstAppButton />
            </Flex>
          ) : (
            <Flex flexDirection="column" my={10} alignItems="center">
              <Image alt="gym" width="200px" src="/dumbbell.svg" />
              <Text
                mt={4}
                mb={2}
                color="gray.800"
                fontSize="xl"
                fontWeight="semibold"
              >
                You have {repositories.length} Reactivated app
                {repositories.length > 1 ? 's' : ''}
              </Text>
              <Text mb={5} textAlign="center" maxWidth="20rem" color="gray.500">
                Dependencies of your Reactivated apps are automatically
                refreshed <b>every 4 hours</b> by our system.
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  )
}

export default Home
