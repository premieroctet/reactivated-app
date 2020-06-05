import React from 'react'
import { Button, Text, Flex, Badge } from '@chakra-ui/core'
import * as RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { Link } from 'react-router-dom'
import { useAxiosRequest } from '@hooks/useRequest'

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
      <Flex
        bg="white"
        mb={10}
        rounded={10}
        shadow="md"
        direction="column"
        flex="1"
        py={[5, 10]}
        px={[0, 10]}
      >
        <Flex
          bg="white"
          mt={3}
          mb={5}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={['2xl', '3xl', '3xl', '3xl']}>
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
              Add app
            </Button>
          </Link>
        </Flex>
      </Flex>
      <RepositoriesList repositories={repositories} />
    </>
  )
}

export default Home
