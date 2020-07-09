import {
  Avatar,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Skeleton,
  MenuDivider,
} from '@chakra-ui/core'
import Header from '@components/Header'
import Router from '@containers/Router'
import { useAuth } from '@contexts/AuthContext'
import { Global } from '@emotion/core'
import { deleteFromStorage } from '@rehooks/local-storage'
import React from 'react'
import WaitingBeta from '../WaitingBeta'
import { Link } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'

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
                  {jwTokenData?.avatarUrl ? (
                    <Avatar
                      name={jwTokenData?.userName}
                      size="sm"
                      bg="brand.500"
                      src={jwTokenData?.avatarUrl}
                    />
                  ) : (
                    <Skeleton rounded="full">
                      <Avatar size="sm" bg="brand.500" />
                    </Skeleton>
                  )}
                  <Icon color="white" fontSize="2xl" name="chevron-down" />
                </Flex>
              </MenuButton>
              <MenuList zIndex={100}>
                <Link to="/settings">
                  <MenuItem>
                    <Button leftIcon="settings" variant="ghost">
                      Settings
                    </Button>
                  </MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={logOut}>
                  <Button leftIcon={FiLogOut} variant="ghost">
                    Logout
                  </Button>
                </MenuItem>
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
      />
      <Box
        mb={10}
        p={[3, 3, 3, 0]}
        maxWidth="60rem"
        marginX="auto"
        position="relative"
      >
        {process.env.REACT_APP_IS_BETA === 'true' &&
        jwTokenData?.validated === false ? (
          <WaitingBeta />
        ) : (
          <Router />
        )}
      </Box>
    </>
  )
}

export default AuthApp
