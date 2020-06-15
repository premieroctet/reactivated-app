import { Box, Flex, Text } from '@chakra-ui/core'
import React from 'react'
import { Repository } from '../../typings/entities'

interface FrameworkTagProps extends Pick<Repository, 'framework'> {}

const FrameworkTag: React.FC<FrameworkTagProps> = ({ framework }) => {
  const getFrameworkColor = (framework: FrameworkTag) => {
    switch (framework) {
      case 'react':
      case 'react native':
        return '#61dafb'

      case 'vue':
        return '#4fc08d'

      case 'angular':
      case 'nest.js':
        return 'red.500'

      default:
        return '#000'
    }
  }

  return (
    <Flex justifyItems="center" alignItems="center">
      <Box
        mr={1}
        height="10px"
        width="10px"
        rounded={10}
        bg={getFrameworkColor(framework)}
      />
      <Text fontSize="sm">{framework}</Text>
    </Flex>
  )
}

export default FrameworkTag
