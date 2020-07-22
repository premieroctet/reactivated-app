import React from 'react'
import {
  Button,
  Text,
  Box,
  DarkMode,
  Flex,
  Stack,
  Image,
  Link,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import Header from '@components/Header'
import { Global } from '@emotion/core'
import DemoItemMotion from '../components/Demo/DemoItem'
import { Column } from '../components/Flex'
import HeaderLinks from '@components/Header/HeaderLinks'
import { useHistory } from 'react-router'

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
    <Flex color="black" fontWeight="600">
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
  const history = useHistory()

  return (
    <DarkMode>
      <Global
        styles={{
          body: {
            backgroundColor: '#24294e',
          },
        }}
      />
      <Box h="auto">
        <Box maxWidth="60rem" marginX="auto">
          <Header>
            <HeaderLinks loading={loading} />
          </Header>

          <Box as="main" mb={10}>
            <Flex direction="column" alignItems="center">
              <Text
                mt={10}
                textAlign="center"
                color="white"
                fontSize="5xl"
                fontWeight="bold"
              >
                Keep your JS apps up to date! ✨
              </Text>
              <Text
                as="div"
                maxWidth="40rem"
                textAlign="center"
                color="whiteAlpha.800"
                fontSize="2xl"
              >
                <Text as="span" color="white">
                  Reactivated.app
                </Text>{' '}
                is an open-source app that scans your JS dependencies every 4
                hours and generates{' '}
                <Link textDecoration="underline" color="brand.500" href="/demo">
                  a cool sum up
                </Link>
                .
              </Text>
            </Flex>

            <Flex my={10} justifyContent="center">
              <Button
                onClick={() => {
                  history.push('/demo')
                }}
                variant="outline"
                variantColor="brand"
                rounded={8}
                mr={5}
                size="lg"
              >
                See Example
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `${process.env.REACT_APP_API_HOST}/auth/github`
                }}
                isLoading={loading}
                variantColor="brand"
                rightIcon={FaGithub}
                rounded={8}
                size="lg"
              >
                Login with GitHub
              </Button>
            </Flex>
          </Box>
        </Box>

        <Box pb={10} pos="relative" backgroundColor="#e2e8f0">
          <Box
            position="relative"
            zIndex={1}
            pt={4}
            maxWidth="60rem"
            marginX="auto"
          >
            <Box width="100%" display="flex" justifyContent="center">
              <Image
                alt="Reactivated.app UI"
                width="90%"
                shadow="lg"
                src="/p4.png"
              />
            </Box>
            <Box my={10}>
              <Column align="center">
                <Text
                  borderBottom="6px solid #43ee9c"
                  fontWeight="bold"
                  fontSize="4xl"
                  my={5}
                >
                  Curious? Check It Out:
                </Text>
                <Box w="60%" minW="400px">
                  <DemoItemMotion whileHover={{ scale: 1.02, x: 10 }} />
                </Box>
              </Column>
            </Box>
          </Box>
          <Box
            zIndex={0}
            backgroundColor="#24294e"
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="140px"
          />
        </Box>
      </Box>

      <Box py={6} color="white" as="footer">
        <Box textAlign="center" maxWidth="60rem" marginX="auto">
          Developped with ☕️ by{' '}
          <Link
            href="https://premieroctet.com"
            isExternal
            textDecoration="underline"
            color="brand.500"
          >
            Premier Octet
          </Link>
        </Box>
      </Box>
    </DarkMode>
  )
}

export default Home
