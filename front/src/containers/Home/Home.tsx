import React, { useState, useEffect } from 'react'
import { Button, Link as ChakraLink, Text } from '@chakra-ui/core'
import { useAuth } from '@contexts/AuthContext'
import RepositoriesAPI from '@api/repositories'
import RepositoriesList from '@components/RepositoriesList'
import { Column } from '@components/Flex'
import { FaGithub } from 'react-icons/fa'

function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const { jwTokenData } = useAuth()
  const { userId } = jwTokenData!

  const loadRepository = async () => {
    const responseApi = await RepositoriesAPI.getRepositories(userId)
    setRepositories(responseApi.data)
  }

  useEffect(() => {
    loadRepository()
    // eslint-disable-next-line
  }, [])

  return (
    <Column flex="1">
      <Column px={2} flex="1" py={16} align="center">
        <ChakraLink
          textDecoration="none !important"
          href={`https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`}
        >
          <Button
            cursor="pointer"
            size="lg"
            variantColor="teal"
            variant="solid"
            leftIcon={FaGithub}
          >
            Add repository
          </Button>
        </ChakraLink>
        <Text fontSize={['sm', 'lg', '2xl', '3xl']} fontWeight="bold" my={8}>
          Repositories Available
        </Text>
        <RepositoriesList repositories={repositories} />
      </Column>
    </Column>
  )
}

export default Home
