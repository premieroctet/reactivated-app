import React from 'react'
import {
  Flex,
  Box,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/core'
import Router from '@containers/Router'
import { deleteFromStorage } from '@rehooks/local-storage'
import Header from '@components/Header'
import { Global } from '@emotion/core'
import { useAuth } from '@contexts/AuthContext'

const AuthApp = () => {
  const logOut = () => {
    deleteFromStorage('token')
  }

  const { jwTokenData } = useAuth()

  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: '#f5f9f9',
          },
        }}
      />

      <Box bg="#24294e" px={3}>
        <Box maxWidth="60rem" marginX="auto">
          <Header>
            <Menu>
              <MenuButton>
                <Flex alignItems="center">
                  <Avatar
                    name={jwTokenData?.userName}
                    size="sm"
                    bg="brand.500"
                  />
                  <Icon color="white" fontSize="2xl" name="chevron-down" />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Header>
        </Box>
      </Box>

      <Box
        backgroundColor="#24294e"
        height="7rem"
        position="absolute"
        left={0}
        right={0}
      ></Box>
      <Box maxWidth="60rem" marginX="auto" position="relative">
        <Flex
          mb={10}
          minHeight="20rem"
          bg="white"
          rounded={10}
          shadow="md"
          direction="column"
          flex="1"
          py={[5, 10]}
          px={[0, 10]}
        >
          <Router />
        </Flex>
      </Box>
    </>
  )
}

export default AuthApp
