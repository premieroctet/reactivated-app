import React from 'react'
import { Button, Text, Flex, Badge } from '@chakra-ui/core'
import * as RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { Link } from 'react-router-dom'
import { useAxiosRequest } from '@hooks/useRequest'
import { Repository } from '../typings/entities'
import Container from '@components/Container'

export const getMaxRepositories = () => {
  return parseInt(process.env.REACT_APP_MAX_REPOS || '5', 10)
}

function Home() {
  const { data: repositories } = useAxiosRequest<Repository[]>(
    '/repositories',
    {
      fetcher: RepositoriesAPI.getRepositories,
    },
  )

  if (!repositories) {
    return null
  }

  return (
    <>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl">
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
              isDisabled={repositories.length >= getMaxRepositories()}
            >
              Add app
            </Button>
          </Link>
        </Flex>
      </Container>
      <RepositoriesList repositories={repositories} />
    </>
  )
}

export default Home
