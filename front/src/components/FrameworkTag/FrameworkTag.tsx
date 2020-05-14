import { Tag } from '@chakra-ui/core'
import React from 'react'

interface FrameworkTagProps extends Pick<Repository, 'framework'> {}

const FrameworkTag: React.FC<FrameworkTagProps> = ({ framework }) => {
  const getFrameworkColor = (framework: FrameworkTag) => {
    if (framework === 'react') {
      return '#61DBFB'
    }
    if (framework === 'react native') {
      return '#61DBFB'
    }
    if (framework === 'vue') {
      return '#41B883'
    }
    if (framework === 'angular') {
      return '#DD0031'
    }
    if (framework === 'next.js') {
      return 'black'
    }
    if (framework === 'nest.js') {
      return '#E0234E'
    }
    if (framework === 'express') {
      return 'black'
    }
  }

  return (
    <Tag size="sm" variant="subtle" color={getFrameworkColor(framework)}>
      {framework.toUpperCase()}
    </Tag>
  )
}

export default FrameworkTag
