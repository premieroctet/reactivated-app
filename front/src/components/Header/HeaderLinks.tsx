import React from 'react'
import { Button } from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import { useHistory } from 'react-router'

const HeaderLinks: React.FC<{ loading: boolean }> = ({ loading }) => {
  const history = useHistory()

  return (
    <>
      <Button
        onClick={() => {
          history.push('/demo')
        }}
        variant="link"
        variantColor="brand"
        rounded={8}
        mr={5}
      >
        Demo
      </Button>
      <Button
        onClick={() => {
          window.location.href = `https://github.com/premieroctet/reactivated-app/`
        }}
        variant="link"
        variantColor="brand"
        rounded={8}
        mr={5}
      >
        GitHub Project
      </Button>
      <Button
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_API_HOST}/auth/github`
        }}
        isLoading={loading}
        variantColor="brand"
        rightIcon={FaGithub}
        rounded={8}
      >
        Login
      </Button>
    </>
  )
}

export default HeaderLinks
