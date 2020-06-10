import { Text } from '@chakra-ui/core'
import React from 'react'
import Container from '../components/Container'

type Props = {}

const WaitingBeta: React.FC<Props> = () => {
  return (
    <Container>
      <Text>We will soon validate your account...</Text>
    </Container>
  )
}

export default WaitingBeta
