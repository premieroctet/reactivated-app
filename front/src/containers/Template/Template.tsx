import React from 'react'
import { Text, Link, Button } from '@chakra-ui/core'
import Router from '@containers/Router'
import { deleteFromStorage } from '@rehooks/local-storage'
import Header from '@components/Header'
import { Column, Row } from '@components/Flex'
import { FaPowerOff } from 'react-icons/fa'

function Template() {
  const logOut = () => {
    deleteFromStorage('token')
  }

  const renderRight = () => {
    return (
      <Button
        cursor="pointer"
        leftIcon={FaPowerOff}
        variantColor="teal"
        onClick={logOut}
      >
        Logout
      </Button>
    )
  }

  return (
    <Column minH="100vh" bg="gray.50">
      <Header renderRight={renderRight} />
      <Column
        flex={1}
        justify="flex-start"
        px={[4, 0]}
        w={['100%', 'xl', '2xl', '3xl']}
        m="0 auto"
      >
        <Router />
      </Column>
      <Row justify="center" align="center" py={4}>
        <Text as="span">
          <Text as="span" fontWeight="bold">
            Reactivated App{' '}
            <Text as="span" role="img" aria-label="light">
              🚀
            </Text>
            {' ©2019 '}
          </Text>
          {' by '}
          <Link
            href="https://www.premieroctet.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Premier Octet
          </Link>
        </Text>
      </Row>
    </Column>
  )
}

export default Template
