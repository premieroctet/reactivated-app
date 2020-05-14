import { Badge, Box } from '@chakra-ui/core'
import React from 'react'

interface FrameworkTagProps extends Pick<Repository, 'framework'> {}

const FrameworkTag: React.FC<FrameworkTagProps> = ({ framework }) => {
  const getFrameworkColor = (framework: FrameworkTag) => {
    switch (framework) {
      case 'react':
      case 'react native':
        return 'blue'

      case 'vue':
        return 'green'

      case 'angular':
      case 'nest.js':
        return 'red'

      default:
        return 'black'
    }
  }

  return (
    <Box>
      <Badge variant="subtle" variantColor={getFrameworkColor(framework)}>
        {framework.toUpperCase()}
      </Badge>
    </Box>
  )
}

export default FrameworkTag
