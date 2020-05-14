import React from 'react'
import { Button, Text, Flex, Badge } from '@chakra-ui/core'
import * as RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { Link } from 'react-router-dom'
import { useAxiosRequest } from '@hooks/useRequest'

function Home() {
  const { data: repositories, ...a } = useAxiosRequest('/repositories', {
    fetcher: RepositoriesAPI.getRepositories,
  })

  if (!repositories) {
    return null
  }

  return (
    <>
      <Flex mb={10} alignItems="center" justifyContent="space-between">
        <Text fontSize={['sm', 'lg', '2xl', '3xl']}>
          My Reactivated <b>apps</b>{' '}
          {repositories.length > 0 && (
            <Badge variantColor="brand" fontSize="sm">
              {repositories.length}
            </Badge>
          )}
        </Text>

        <Link to="/add-repository">
          <Button
            cursor="pointer"
            variantColor="green"
            variant="ghost"
            leftIcon="add"
          >
            New site from GitHub
          </Button>
        </Link>
      </Flex>

      <RepositoriesList repositories={repositories} />
    </>
  )
}

export default Home
