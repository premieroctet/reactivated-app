import React from 'react'
import {
  Skeleton,
  Flex,
  Button,
  Stack,
  Box,
  Heading,
  Text,
  Code,
} from '@chakra-ui/core'
import { Column } from '@components/Flex'

const ViewRepoSkeleton = () => {
  return (
    <Column px={[4, 0]}>
      <Flex justifyContent="space-between">
        <Skeleton mb={4}>
          <Button>Dashboard</Button>
        </Skeleton>

        <Skeleton mb={4}>
          <Button>Settings</Button>
        </Skeleton>
      </Flex>

      <Stack isInline spacing={4} my={4}>
        <Skeleton rounded="lg" size={[16, 24]} />
        <Box>
          <Skeleton mb={1}>
            <Heading fontSize="2xl">My Application</Heading>
          </Skeleton>
          <Skeleton width="6rem" height={4}>
            @username
          </Skeleton>
        </Box>
      </Stack>

      <Stack>
        <Skeleton width="20rem" mt={10}>
          <Heading as="h3" fontSize="xl">
            Outdated Dependencies
          </Heading>
        </Skeleton>
        <Skeleton height={3} width="10rem">
          <Text>Refreshed 1day ago</Text>
        </Skeleton>
      </Stack>
      <Box w={['100%', 'unset']} minW={['100%']} mt={4}>
        <Skeleton height={10}>Tabs</Skeleton>
        <Skeleton width="100%" rounded={10} my={5} p={5}>
          <Code></Code>
        </Skeleton>

        {[...new Array(5)].map(() => (
          <Skeleton width="20rem" height={10} mb={4} rounded={10}>
            Dep
          </Skeleton>
        ))}
      </Box>
    </Column>
  )
}

export default ViewRepoSkeleton
