import React from 'react'
import { Flex, Icon, Box } from '@chakra-ui/core'
import { Link } from 'react-router-dom'

const RepositoryListEmpty: React.FC = () => {
  return (
    <Link to="/add-repository">
      <Flex
        border="2px dashed"
        borderColor="gray.300"
        position="relative"
        cursor="pointer"
        rounded={10}
        mb={4}
        px={5}
        py={10}
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Box py={2} color="gray.500" fontSize="xl">
          Plug <b>new app</b> <Icon name="small-add" />
        </Box>
      </Flex>
    </Link>
  )
}

export default RepositoryListEmpty
