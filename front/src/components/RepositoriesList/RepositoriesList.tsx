import React from 'react'
import { Flex, Button, Text } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import RepositoryListItem from './RepositoryListItem'
import { FaPlug } from 'react-icons/fa'
import { Repository } from '../../typings/entities'
import RepositoryListEmpty from './RepositoryListEmpty'
import { getMaxRepositories } from '@containers/Dashboard'

interface Props {
  repositories: Repository[]
}

const RepositoriesList = ({ repositories }: Props) => {
  if (repositories.length === 0) {
    return (
      <Flex my={10} direction="column" alignItems="center">
        <Text mb={2} color="gray.800" fontSize="xl" fontWeight="semibold">
          No application
        </Text>

        <Text mb={5} textAlign="center" maxWidth="25rem" color="gray.400">
          You have no reactivated app yet! Start now by adding yout from a
          GitHub repository
        </Text>

        <Link to="/add-repository">
          <Button
            rightIcon={FaPlug}
            cursor="pointer"
            variantColor="secondary"
            variant="solid"
          >
            Reactivate your first app
          </Button>
        </Link>
      </Flex>
    )
  }

  const emptyBlockCount = getMaxRepositories() - repositories.length

  return (
    <Flex flexDirection="column" width={500}>
      {repositories.map((repository) => (
        <Link key={repository.id} to={`/repo/${repository.id}`}>
          <RepositoryListItem repository={repository} />
        </Link>
      ))}
      {[...new Array(emptyBlockCount < 0 ? 0 : emptyBlockCount)].map(() => (
        <RepositoryListEmpty />
      ))}
    </Flex>
  )
}

export default RepositoriesList
