import { Box } from '@chakra-ui/core'
import React from 'react'

interface Props extends Pick<Repository, 'score'> {}

const LoadBar: React.FC<Props> = ({ score }) => (
  <Box
    bg="brand.50"
    position="absolute"
    bottom={0}
    height={1}
    left={0}
    right={0}
    zIndex={0}
  >
    <Box
      bg="brand.500"
      position="absolute"
      bottom={0}
      height={1}
      left={0}
      transition="width 300ms"
      width={`${score}%`}
      zIndex={0}
    />
    <Box
      shadow="lg"
      position="absolute"
      bottom={0}
      height={1}
      width={2}
      bg="brand.500"
      boxShadow="2px 1px 6px 3px rgba(71,253,167,0.6)"
      left={`${score}%`}
      zIndex={20}
    />
  </Box>
)

export default LoadBar
