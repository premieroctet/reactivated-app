import { Box, Flex, Text } from '@chakra-ui/core'
import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import PullRequestItem from '../../components/PullRequest/PullRequestItem'
import { useAxiosRequest } from '../../hooks/useRequest'
import { getPullRequests } from '../../api/repositories'
import { PullRequest } from '@typings/entities'

const ViewPullRequest = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const { data } = useAxiosRequest<PullRequest[]>(
    `repositories/${id}/pull-requests`,
    {
      fetcher: () => getPullRequests(id),
    },
  )

  return (
    <>
      {data && data.length > 0 ? (
        <>
          <Box w="100%" py={4}>
            {data.map((pullRequest) => (
              <PullRequestItem pullRequest={pullRequest} />
            ))}
          </Box>
        </>
      ) : (
        <Flex
          alignItems="center"
          flexDirection="column"
          justify="space-around"
          height="10rem"
        >
          <Text color="secondary.50" fontSize="xl">
            No pull requests
          </Text>
        </Flex>
      )}
    </>
  )
}

export default ViewPullRequest
