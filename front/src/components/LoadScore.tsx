import { Text, Box } from '@chakra-ui/core'
import React from 'react'
import { Repository } from '../typings/entities'

interface Props extends Pick<Repository, 'score'> {}

const LoadScore: React.FC<Props> = ({ score }) => {
  return (
    <Box textAlign="center">
      <Box>
        <Text as="span" fontWeight="600" fontSize="4xl">
          {score}
        </Text>
        <Text as="span" fontWeight="600" fontSize="md">
          %
        </Text>
      </Box>
      <Text opacity={0.6} fontSize="sm" mt={-2}>
        Total Load
      </Text>
    </Box>
  )
}

export default LoadScore
