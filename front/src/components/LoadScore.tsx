import { Box, BoxProps, Text } from '@chakra-ui/core'
import React from 'react'
import CountUp from 'react-countup'
import { useRepository } from '../contexts/RepositoryContext'
import { Repository } from '../typings/entities'

interface Props extends Pick<Repository, 'score'> {
  isSmall?: boolean
}

const LoadScore = React.forwardRef<BoxProps, Props>(
  ({ score, isSmall = false }, ref) => {
    const { repository, score: scoreCtxt } = useRepository()
    return (
      <Box ref={ref} textAlign="center">
        <Box>
          <Text as="span" fontWeight="600" fontSize={isSmall ? '2xl' : '4xl'}>
            {repository && scoreCtxt >= repository.score ? (
              <CountUp
                start={0}
                end={score}
                preserveValue={true}
                duration={1}
              />
            ) : (
              score
            )}
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
