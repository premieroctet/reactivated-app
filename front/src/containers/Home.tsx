import React from 'react'
import {
  Button,
  Text,
  Box,
  DarkMode,
  Flex,
  Stack,
  SimpleGrid,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import Header from '@components/Header'
import { Global } from '@emotion/core'

interface Props {
  loading?: boolean
}

interface ICardProps {
  title: string
  bullet: number
  picture: string
}

const Card: React.FC<ICardProps> = ({ title, bullet, picture }) => (
  <Stack spacing={4} direction="column">
    <Flex fontWeight="600">
      <Box
        mr={2}
        bg="brand.500"
        width={6}
        height={6}
        rounded={100}
        fontWeight="bold"
        color="#24294e"
      >
        {bullet}
      </Box>
      {title}
    </Flex>
    <Box
      overflow="hidden"
      border="1px solid white"
      height={40}
      rounded={10}
      bg="#b4b5bc"
      width="100%"
      bgImage={`url(${picture})`}
    ></Box>
  </Stack>
)

const Home = ({ loading = false }: Props) => {
  return (
    <DarkMode>
      <Global
        styles={{
          body: {
            backgroundColor: '#24294e',
          },
        }}
      />
      <Box h="auto" mx={4}>
        <Box maxWidth="60rem" marginX="auto">
          <Header>
            <Button
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_API_HOST}/auth/github`
              }}
              variant="outline"
              variantColor="brand"
              isLoading={loading}
              rightIcon={FaGithub}
              rounded={8}
            >
              Sign in with Github
            </Button>
          </Header>

          <Box as="main">
            <SimpleGrid columns={[1, 1, 2]}>
              <Flex alignItems="center" direction="row">
                <Flex direction="column" fontSize="6xl">
                  <Text fontWeight="extrabold" color="white">
                    <Text as="span" color="brand.500">
                      React
                    </Text>
                    ivated
                  </Text>
                  <Flex mt={-10} alignItems="center" justifyContent="flex-end">
                    <Text
                      mr={2}
                      fontSize="3xl"
                      fontWeight="extrabold"
                      color="white"
                    >
                      ⬤
                    </Text>
                    <Text fontWeight="extrabold" color="white">
                      app
                    </Text>
                  </Flex>
                  <Text textAlign="right" color="white" fontSize="2xl">
                    Keep your JS app <b>up to date</b>
                  </Text>
                </Flex>
              </Flex>
              <Flex p={[5, 10, 0]}>
                <img alt="Reactivated App" height={100} src="/hero.svg" />
              </Flex>
            </SimpleGrid>
          </Box>

          <SimpleGrid
            columns={[1, 2, 3]}
            mt={[15, 15, 40]}
            spacingX={5}
            spacingY={5}
            as="section"
            textAlign="center"
            color="white"
          >
            <Card
              bullet={1}
              title="Connect you repo"
              picture="/feat-repo.png"
            />
            <Card
              bullet={2}
              title="Get improvements"
              picture="/feat-improvement.png"
            />
            <Card
              bullet={3}
              title="Create PR with ease"
              picture="/feat-pr.png"
            />
          </SimpleGrid>
        </Box>

        <Box my={20} as="section" textAlign="center" color="brand.500">
          <Text color="white" fontSize="3xl" fontWeight="bolder" mb={5}>
            Your app deserves fresh dependencies
          </Text>

          <Button
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_API_HOST}/auth/github`
            }}
            variant="outline"
            variantColor="brand.500"
            isLoading={loading}
            rightIcon={FaGithub}
            size="lg"
            rounded={8}
          >
            Add your repo now
          </Button>
        </Box>
      </Box>
    </DarkMode>
  )
}

export default Home
