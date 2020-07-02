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
} from '@chakra-ui/core'
import Header from '@components/Header'
import Router from '@containers/Router'
import { useAuth } from '@contexts/AuthContext'
import { Global } from '@emotion/core'
import { deleteFromStorage } from '@rehooks/local-storage'
import React from 'react'
import WaitingBeta from '../WaitingBeta'
import { Link } from 'react-router-dom'
import { IoIosExit } from 'react-icons/io'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useRepository } from '../../contexts/RepositoryContext'

const AuthApp = () => {
  const logOut = () => {
    deleteFromStorage('token')
  }

  const { jwTokenData } = useAuth()
  const { width, height } = useWindowSize()
  const { showConfettis } = useRepository()

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
                    src={jwTokenData?.avatarUrl}
                  />
                  <Icon color="white" fontSize="2xl" name="chevron-down" />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logOut}>
                  <Button leftIcon={IoIosExit} variant="ghost">
                    Logout
                  </Button>
                </MenuItem>
                <Link to="/settings">
                  <MenuItem>
                    <Button leftIcon="settings" variant="ghost">
                      Settings
                    </Button>
                  </MenuItem>
                </Link>
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
        {process.env.REACT_APP_IS_BETA === 'true' &&
        jwTokenData?.validated === false ? (
          <WaitingBeta />
        ) : (
          <Router />
        )}
      </Box>
      <Confetti
        width={width}
        height={height}
        run={showConfettis}
        recycle={false}
        numberOfPieces={800}
        initialVelocityY={14}
      />
    </>
  )
}

export default AuthApp
