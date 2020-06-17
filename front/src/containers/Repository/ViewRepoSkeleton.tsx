import React from 'react'
import { Skeleton, Stack, Box, Heading, Text, Code } from '@chakra-ui/core'
import Container from '@components/Container'
import FrameworkTag from '@components/FrameworkTag/FrameworkTag'

const ViewRepoSkeleton = () => {
  return (
    <>
      <Container py={[2, 5]} px={[2, 5]}>
        <Skeleton mb={4} />
        <Stack isInline spacing={4}>
          <Skeleton rounded="lg" size={[16, 24]} />
          <Box backgroundColor="yellow">
            <Skeleton>
              <Heading fontSize="2xl">repo name</Heading>
            </Skeleton>

            <Stack alignItems="center" my={2} isInline>
              <Skeleton>
                <Box display="flex" justifyContent="space-between">
                  <FrameworkTag framework="react" />
                </Box>
              </Skeleton>
              <Box fontSize="sm">
                <Skeleton>19 days ago</Skeleton>
              </Box>
            </Stack>

            <Skeleton>
              <Text
                borderTop="1px dashed"
                borderTopColor="gray.300"
                pt={2}
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                link repo
              </Text>
            </Skeleton>
          </Box>
        </Stack>
      </Container>

      <Container>
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

          {[...new Array(5)].map((_, i) => (
            <Skeleton width="20rem" height={10} mb={4} rounded={10} key={i}>
              Dep
            </Skeleton>
          ))}
        </Box>
      </Container>
    </>
  )
}

export default ViewRepoSkeleton
