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
        title: 'Account deleted.',
        description: 'Your account has been correctly deleted',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      return toast({
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
      </Container>
    </>
  )
}

export default Settings
