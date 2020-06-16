import { Button, Text } from '@chakra-ui/core'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import Container from '../components/Container'
import { useAuth } from '../contexts/AuthContext'
import { deleteAccount } from '../api/user'
const Settings = () => {
  const { jwTokenData } = useAuth()

  const onDeleteAccount = async () => {
    const res = await deleteAccount(jwTokenData?.userId)
    console.log('onDeleteAccount -> res', res)
  }

  return (
    <>
      <Container>
        <Text fontSize="2xl">Settings</Text>
      </Container>

      <Container>
        <Button
          leftIcon={FaTrash}
          variantColor="red"
          variant="outline"
          onClick={onDeleteAccount}
        >
          Delete my account
        </Button>
      </Container>
    </>
  )
}

export default Settings
