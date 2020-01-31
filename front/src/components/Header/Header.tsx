import React, { ReactNode } from 'react'
import { Row } from '@components/Flex'
import { Heading } from '@chakra-ui/core'
import { Link } from 'react-router-dom'

interface Props {
  renderRight: () => ReactNode
}

const Header = ({ renderRight }: Props) => {
  return (
    <Row w="100%" align="center" justify="space-between" py={6} px={6}>
      <Link to="/">
        <Heading size="lg" cursor="pointer">
          Reactivated
        </Heading>
      </Link>
      {renderRight && renderRight()}
    </Row>
  )
}

export default Header
