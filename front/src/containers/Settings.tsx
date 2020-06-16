import { Button, Text } from '@chakra-ui/core'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import Container from '../components/Container'
import { useAuth } from '../contexts/AuthContext'
import { deleteAccount } from '../api/user'
const Settings = () => {
  const { jwTokenData } = useAuth()
  const [deleteAccountSuccess, setDeleteAccountSuccess] = React.useState(false)
  const onDeleteAccount = async () => {
    const res = await deleteAccount(jwTokenData?.userId)
    if (res.status === 201) {
      setDeleteAccountSuccess(true)
    }
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

        {deleteAccountSuccess && (
          <Text color="green.300">Your account has been correctly deleted</Text>
        )}
      </Container>
    </>
  )
}

export default Settings
