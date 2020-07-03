import {
  Badge,
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  Tooltip,
  Image,
  IconButton,
  Stack,
} from '@chakra-ui/core'
import Container from '@components/Container'
import React from 'react'
import { Link } from 'react-router-dom'
import RepositoryListItem from '../components/RepositoriesList/RepositoryListItem'
import { Repository } from '../typings/entities'
import LoadBar from '../components/LoadBar'
import { Row } from '../components/Flex'

const DashboardSkeleton = () => {
  const repository: Repository = {
    id: 66,
    name: 'yarnlock',
    fullName: 'thozh/yarnlock',
    githubId: '267258739',
    installationId: '104924',
    author: 'thozh',
    repoImg: 'https://avatars2.githubusercontent.com/u/37123351?v=4',
    createdAt: '2020-07-01T11:57:36.000Z',
    dependenciesUpdatedAt: '2020-07-02T14:00:19.000Z',
    repoUrl: 'https://github.com/thozh/yarnlock',
    packageJson: { dependencies: {}, devDependencies: {} },
    dependencies: { deps: [] },
    branch: 'master',
    path: '/',
    isConfigured: true,
    score: 50,
    framework: 'react',
    hasYarnLock: true,
    crawlError: '',
    users: [
      {
        id: 16,
        username: 'thozh',
        githubId: '121',
        githubToken: 'qded',
      },
    ],
    pullRequests: [],
  }

  return (
    <>
      <Container py={[2, 5]} px={[2, 5]}>
        <Flex alignItems="center" justifyContent="space-between">
          <Skeleton rounded="md">
            <Text fontSize="2xl">
              My Reactivated <b>apps</b>{' '}
              <Badge variantColor="brand" fontSize="sm">
                {3}
              </Badge>
            </Text>
          </Skeleton>

          <Skeleton>
            <Tooltip
              hasArrow
              label={`Max repositories reached : ${process.env.REACT_APP_MAX_REPOS}`}
              aria-label={'Max repositories reached'}
              placement="left"
            >
              <Link to="/add-repository">
                <Button
                  cursor="pointer"
                  variantColor="green"
                  variant="ghost"
                  leftIcon="add"
                >
                  Add app
                </Button>
              </Link>
            </Tooltip>
          </Skeleton>
        </Flex>
      </Container>

      <Flex flexDirection="column" width={500}>
        {Array.from(Array(5).keys()).map((_, i) => (
          <Flex
            position="relative"
            rounded={10}
            shadow="md"
            bg={'white'}
            my={1}
            px={5}
            py={8}
            overflow="hidden"
            key={i}
            width="100%"
          >
            <Flex
              flexDirection="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Row justifyContent="center">
                <Skeleton rounded={40} mr={2}>
                  <Image
                    size={16}
                    borderRadius={40}
                    src={repository.repoImg}
                    alt={repository.name}
                  />
                </Skeleton>
                <Stack>
                  <Skeleton>reactivated-app</Skeleton>

                  <Row>
                    <Skeleton size={4} rounded={'full'} mr={1} />
                    <Skeleton size={4} width="50px">
                      react
                    </Skeleton>
                  </Row>
                </Stack>
              </Row>

              <Row alignItems="center">
                <Skeleton mr={4} size={12}>
                  <Box>88 %</Box>
                </Skeleton>

                <Skeleton size={6}>
                  <IconButton
                    variant="ghost"
                    fontSize="3xl"
                    aria-label="View"
                    icon="chevron-right"
                  />
                </Skeleton>
              </Row>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}

export default DashboardSkeleton
