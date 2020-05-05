import React from 'react'
import { Text, Flex, Stack, Box } from '@chakra-ui/core'
import { FaPlug } from 'react-icons/fa'

const Header: React.FC = ({ children }) => {
  return (
    <Flex pb={10} as="header" pt={10} justifyContent="space-between">
      <Stack isInline alignItems="center">
        <Box color="brand.500" fontSize="2xl" as={FaPlug} />
        <Flex alignItems="center">
          <Text color="brand.500" fontSize="2xl" fontWeight="bold">
            Reactivated
          </Text>
          <Text color="white" fontSize="xs" mx={1}>
            ⬤
          </Text>
          <Text color="white" fontSize="2xl">
            app
          </Text>
        </Flex>
      </Stack>
      <Flex>{children}</Flex>
    </Flex>
  )
}

export default Header
