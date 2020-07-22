import React from 'react'
import { Button } from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'

const HeaderLinks: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <>
      <Button
        display={['none', 'block']}
        onClick={() => {
          window.location.href = `https://github.com/premieroctet/reactivated-app/`
        }}
        variant="link"
        variantColor="brand"
        rounded={8}
        mr={5}
      >
        GitHub
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
