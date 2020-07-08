import React from 'react'
import { Flex, Icon, Box, FlexProps } from '@chakra-ui/core'
import { Link } from 'react-router-dom'

const RepositoryListEmpty = React.forwardRef<FlexProps>((props, ref) => (
  <Link to="/add-repository">
    <Flex
      ref={ref}
      {...props}
      borderColor="gray.300"
      shadow="md"
      position="relative"
      backgroundColor="white"
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
        Add <b>new app</b> <Icon name="small-add" />
      </Box>
    </Flex>
  </Link>
))

export default RepositoryListEmpty
