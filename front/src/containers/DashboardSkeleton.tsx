import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/core'
import Container from '@components/Container'
import React from 'react'
import { Link } from 'react-router-dom'
import { Row } from '../components/Flex'

const DashboardSkeleton = () => {
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
                  <Image size={16} borderRadius={40} />
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
