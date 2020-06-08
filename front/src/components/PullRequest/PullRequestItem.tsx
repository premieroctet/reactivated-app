import { Box, Stack, Tag, Flex, Text, Link } from '@chakra-ui/core'
import React from 'react'

type PullRequestItemProps = {
  pullRequest: PullRequest
}

const PullRequestItem: React.FC<PullRequestItemProps> = ({ pullRequest }) => {
  const getColorFromStatus = (status: Status) => {
    switch (status) {
      case 'done':
        return 'red.200'
      case 'pending':
        return 'yellow.300'
    }
  }

  return (
    <Stack
      p={2}
      my={2}
      justifyContent="space-between"
      alignItems="center"
      position="relative"
      isInline
      rounded={10}
      borderWidth={1}
    >
      <Flex flex={1} justifyContent="space-between" direction="row">
        <Stack isInline alignItems="center">
          <Box
            bg={getColorFromStatus(pullRequest.status)}
            size={4}
            rounded={20}
          />
          <Tag variantColor="gray" size="sm">
            {pullRequest.status}
          </Tag>
        </Stack>

        {pullRequest.url ? (
          <Link href={pullRequest.url} isExternal>
            <Text fontSize="lg">{pullRequest.branchName}</Text>
          </Link>
        ) : (
          <Text fontSize="lg">{pullRequest.branchName}</Text>
        )}
      </Flex>
    </Stack>
  )
}

export default PullRequestItem
