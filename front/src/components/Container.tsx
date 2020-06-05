import React from 'react'
import { Box, BoxProps } from '@chakra-ui/core'

const Container: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      pos="relative"
      bg="white"
      mb={10}
      rounded={10}
      shadow="md"
      py={[5, 10]}
      px={[0, 10]}
      children={children}
      {...rest}
    />
  )
}

export default Container
