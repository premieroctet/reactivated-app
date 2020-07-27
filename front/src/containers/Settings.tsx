import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
  Box,
} from '@chakra-ui/core'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useHistory } from 'react-router'
import { deleteAccount } from '../api/user'
import Container from '../components/Container'
import { Row } from '../components/Flex'
import { useAuth } from '../contexts/AuthContext'
import { deleteFromStorage } from '@rehooks/local-storage'

const Settings = () => {
  const { jwTokenData } = useAuth()
  const history = useHistory()
  const toast = useToast()

  const onDeleteAccount = async () => {
    try {
      await deleteAccount(jwTokenData?.userId)
      deleteFromStorage('token')
      history.push('/')

      return toast({
        position: 'top-right',
        title: 'Account deleted.',
        description: 'Your account has been correctly deleted',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      return toast({
        position: 'top-right',
        title: 'An error occured.',
        description: 'Unable to delete account',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Container>
        <Text fontSize="2xl">Settings</Text>
      </Container>

      <Container>
        <Box py={10} textAlign="center">
          <Text mb={6}>
            There's not much here... but you can delete your account.
          </Text>
          <Popover>
            <PopoverTrigger>
              <Button leftIcon={FaTrash} variantColor="red" variant="outline">
                Delete my account
              </Button>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                <Text color="red.500">Confirm deletion</Text>
              </PopoverHeader>
              <PopoverBody>
                Are you sure to delete your account?
                <Row justify="center" mt={5}>
                  <Button variantColor="red" onClick={onDeleteAccount}>
                    Confirm
                  </Button>
                </Row>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </Container>
    </>
  )
}

export default Settings
