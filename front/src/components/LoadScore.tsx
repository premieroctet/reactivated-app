import { Box, BoxProps, Text } from '@chakra-ui/core'
import React from 'react'
import { Repository } from '../typings/entities'
import { useRepository } from '../contexts/RepositoryContext'

interface Props extends Pick<Repository, 'score'> {
  isSmall?: boolean
  isAnimated?: boolean
}

const LoadScore = React.forwardRef<BoxProps, Props>(
  ({ score, isSmall = false, isAnimated = false }, ref) => {
    const { scoreCountUp } = useRepository()
    return (
      <Box ref={ref} textAlign="center">
        <Box>
          <Text as="span" fontWeight="600" fontSize={isSmall ? '2xl' : '4xl'}>
            {isAnimated ? scoreCountUp : score}
          </Text>
          <Text as="span" fontWeight="600" fontSize="md">
            %
          </Text>
        </Box>
        <Text opacity={0.6} fontSize={isSmall ? 'xs' : 'sm'} mt={-2}>
          Reactivated
        </Text>
      </Box>
    )
  },
)

export default LoadScore
