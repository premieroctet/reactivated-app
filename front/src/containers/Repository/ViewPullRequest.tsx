import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { getPullRequests } from '../../api/repositories'
import Container from '../../components/Container'
import LoadBar from '../../components/LoadBar'
import { useAxiosRequest } from '../../hooks/useRequest'
import FrameworkTag from '../../components/FrameworkTag/FrameworkTag'
import LoadScore from '../../components/LoadScore'
import PullRequestItem from '../../components/PullRequest/PullRequestItem'

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

  const refreshPR = () => {
    window.location.reload()
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Link to="/">
          <Button
            leftIcon="chevron-left"
            variant="ghost"
            variantColor="brand"
            mb={4}
          >
            Dashboard
          </Button>
        </Link>
        <Button
          leftIcon="repeat"
          variant="ghost"
          variantColor="brand"
          onClick={refreshPR}
        >
          Refresh page
        </Button>
      </Flex>
      {data && data.length > 0 ? (
        <>
          <Container>
            <Flex pr={10} justifyContent="space-between" my={4}>
              <LoadBar score={data[0].repository.score} />
              <Stack isInline spacing={4}>
                <ChakraLink isExternal href={data[0].repository.repoUrl}>
                  <Image
                    rounded={100}
                    src={data[0].repository.repoImg}
                    alt={data[0].repository.name}
                    size={[16, 24]}
                  />
                </ChakraLink>
                <Box backgroundColor="yellow">
                  <Heading fontSize="2xl">{data[0].repository.name}</Heading>

                  <Text
                    mb={2}
                    fontSize="sm"
                    display="flex"
                    justifyContent="space-between"
                  >
                    {data[0].repository?.framework !== null && (
                      <FrameworkTag framework={data[0].repository.framework} />
                    )}
                  </Text>

                  <ChakraLink
                    borderTop="1px dashed"
                    borderTopColor="gray.300"
                    pt={2}
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    isExternal
                    href={`https://github.com/${data[0].repository.fullName}`}
                  >
                    <Box as={FaGithub} mr={1} /> {data[0].repository.fullName}
                  </ChakraLink>
                </Box>
              </Stack>
              <LoadScore score={data[0].repository.score} />
            </Flex>
          </Container>

          {/* Pull Requests list */}
          <Container>
            <Heading mt={10} as="h3" fontSize="xl">
              Pull Requests
            </Heading>
            <Box w="100%" py={4}>
              {data.map((pullRequest) => (
                <PullRequestItem pullRequest={pullRequest} />
              ))}
            </Box>
          </Container>
        </>
      ) : (
        // No pull requests in this repo
        <Container>
          <Flex
            alignItems="center"
            flexDirection="column"
            justify="space-around"
            height="10rem"
          >
            <Text fontSize="4xl">No pull requests found</Text>
            <Button onClick={() => window.location.assign('/')}>
              Go back to dashboard
            </Button>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default ViewPullRequest
