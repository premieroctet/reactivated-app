import { Box, Button, Code, useClipboard } from '@chakra-ui/core'
import React, { useState } from 'react'
import DependencyItem from './DependencyItem'
import PrefixAccordion from './PrefixAccordion'

interface IProps {
  dependencies: (Dependency | PrefixedDependency)[]
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
        {dependencies.map((dep) => {
          if (Array.isArray(dep)) {
            return (
              <DependencyItem
                isStableChecked={packages[dep[0]] === 'stable'}
                isLatestChecked={packages[dep[0]] === 'latest'}
                onSelect={(checked, name, type) => {
                  if (checked) {
                    setPackages({ ...packages, [name]: type })
                  } else {
                    const { [name]: omit, ...rest } = packages
                    setPackages({ ...rest })
                  }
                }}
                dependency={dep}
                key={dep[0]}
              />
            )
          }

          const prefix = Object.keys(dep)[0]
          return (
            <PrefixAccordion
              prefix={prefix}
              packages={packages}
              prefixedDep={dep}
              setPackages={setPackages}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default DependenciesList
