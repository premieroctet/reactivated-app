import React from 'react'
import { Button, Text } from '@chakra-ui/core'
import * as RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { Column } from '@components/Flex'
import { FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAxiosRequest } from '@hooks/useRequest'

function Home() {
  const { data: repositories } = useAxiosRequest('/repositories', {
    fetcher: RepositoriesAPI.getRepositories,
  })

  if (!repositories) {
    return null
  }

  return (
    <Column flex="1">
      <Column px={2} flex="1" py={16} align="center">
        <Link to="/add_repository">
          <Button
            cursor="pointer"
            size="lg"
            variantColor="teal"
            variant="solid"
            leftIcon={FaGithub}
          >
            Add repository
          </Button>
        </Link>
        <Text fontSize={['sm', 'lg', '2xl', '3xl']} fontWeight="bold" my={8}>
          Repositories Available
        </Text>
        <RepositoriesList repositories={repositories} />
      </Column>
    </Column>
  )
}

export default Home
