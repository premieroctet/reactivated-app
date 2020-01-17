import React, { ReactNode } from 'react'
import { Row } from '@components/Flex'
import { Heading } from '@chakra-ui/core'

interface Props {
  renderRight: () => ReactNode
}

const Header = ({ renderRight }: Props) => {
  return (
    <Row w="100%" align="center" justify="space-between" py={6} px={6}>
      <Heading size="lg">Reactivated</Heading>
      {renderRight && renderRight()}
    </Row>
  )
}

export default Header
