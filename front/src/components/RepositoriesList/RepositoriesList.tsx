import React from 'react'
import { List, Button, Text, Flex } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import RepositoryListItem from './RepositoryListItem'
import { FaPlug } from 'react-icons/fa'

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

  return (
    <List width="100%" cursor="pointer" rounded="lg" overflow="hidden">
      {repositories.map((repository) => (
        <Link key={repository.id} to={`/repo/${repository.id}`}>
          <RepositoryListItem
            repoImg={repository.repoImg}
            author={repository.author}
            name={repository.name}
          />
        </Link>
      ))}
    </List>
  )
}

export default RepositoriesList
