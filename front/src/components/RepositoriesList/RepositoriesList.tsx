import React from 'react'
import { List, Box, Button } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import RepositoryListItem from './RepositoryListItem'

interface Props {
  repositories: Repository[]
}

const RepositoriesList = ({ repositories }: Props) => {
  if (repositories.length === 0) {
    return (
      <Box>
        No repo,{' '}
        <Link to="/add-repository">
          <Button cursor="pointer" variantColor="teal" variant="link">
            add one
          </Button>
        </Link>
      </Box>
    )
  }

  return (
    <List
      my="0"
      mx="auto"
      width={['100%', '80%']}
      cursor="pointer"
      boxShadow="md"
      rounded="lg"
      pl={0}
      overflow="hidden"
    >
      {repositories.map((repository, index) => (
        <Link key={repository.id} to={`/repo/${repository.id}`}>
          <RepositoryListItem
            repoImg={repository.repoImg}
            author={repository.author}
            name={repository.name}
            bordered={index < repositories.length - 1}
          />
        </Link>
      ))}
    </List>
  )
}

export default RepositoriesList
