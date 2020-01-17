import React from 'react'
import { Button, Text, Box, Link } from '@chakra-ui/core'
import { Column } from '@components/Flex'
import { FaGithub } from 'react-icons/fa'

interface Props {
  loading?: boolean
}

const Login = ({ loading = false }: Props) => {
  return (
    <Column justify="center" align="center" bg="#282c34" h="100vh">
      <Box>
        <Text fontSize={35} mb={10} color="white">
          reactivated.app{' '}
          <Text as="span" role="img" aria-label="light">
            ⚡️
          </Text>
        </Text>
      </Box>

      <Link
        textDecoration="none !important"
        href={`${process.env.REACT_APP_API_HOST}/auth/github`}
      >
        <Button
          variantColor="teal"
          size="lg"
          isLoading={loading}
          cursor="pointer"
          border="none"
          leftIcon={FaGithub}
        >
          Sign in with Github
        </Button>
      </Link>
    </Column>
  )
}

export default Login
