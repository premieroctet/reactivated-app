import React, { useState } from 'react'
import { Box, Code, Button } from '@chakra-ui/core'
import DependencyItem from './DependencyItem'
import { useClipboard } from '@chakra-ui/core'

interface IProps {
  dependencies: Dependency[]
  isDev?: boolean
}

const DependenciesList: React.FC<IProps> = ({ dependencies, isDev }) => {
  const [packages, setPackages] = useState<{
    [key: string]: 'stable' | 'latest'
  }>({})

  const items = Object.keys(packages).map(
    (key) => `${key}${packages[key] === 'latest' ? `@${packages[key]}` : ''}`,
  )

  const commandeLine = `yarn upgrade ${isDev ? `--dev` : ``} ${items.join(' ')}`
  const { onCopy, hasCopied } = useClipboard(commandeLine)

  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      <Code
        position="relative"
        width="100%"
        rounded={10}
        whiteSpace="normal"
        my={5}
        p={5}
      >
        {Object.keys(packages).length
          ? commandeLine
          : `yarn upgrade ${isDev ? `--dev` : ``} [pick some dependencies]`}
        <Button
          size="xs"
          variantColor="secondary"
          position="absolute"
          right={3}
          top={-6}
          onClick={onCopy}
        >
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      </Code>

      <Box w="100%">
        {dependencies.map((key) => (
          <DependencyItem
            isStableChecked={packages[key[0]] === 'stable'}
            isLatestChecked={packages[key[0]] === 'latest'}
            onSelect={(checked, name, type) => {
              if (checked) {
                setPackages({ ...packages, [name]: type })
              } else {
                const { [name]: omit, ...rest } = packages
                setPackages({ ...rest })
              }
            }}
            dependency={key}
          />
        ))}
      </Box>
    </Box>
  )
}

export default DependenciesList
