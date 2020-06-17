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
} from '@chakra-ui/core'
import { deleteFromStorage } from '@rehooks/local-storage'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { deleteAccount } from '../api/user'
import Container from '../components/Container'
import { Row } from '../components/Flex'
import { useAuth } from '../contexts/AuthContext'

const Settings = () => {
  const { jwTokenData } = useAuth()
  const [deleteAccountSuccess, setDeleteAccountSuccess] = React.useState(false)

  const onDeleteAccount = async () => {
    try {
      await deleteAccount(jwTokenData?.userId)
      setDeleteAccountSuccess(true)
      setTimeout(() => {
        deleteFromStorage('token')
      }, 800)
    } catch (error) {
      console.error(error)
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

        {deleteAccountSuccess && (
          <Text color="green.300">Your account has been correctly deleted</Text>
        )}
      </Container>
    </>
  )
}

export default Settings
