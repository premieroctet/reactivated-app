import { Box, Button, Code, Flex, useClipboard, Text } from '@chakra-ui/core'
import React, { useState } from 'react'
import { createUpgradePR } from '../../api/repositories'
import DependencyItem from './DependencyItem'
import PrefixAccordion from './PrefixAccordion'

interface IProps {
  dependencies: (Dependency | PrefixedDependency)[]
  isDev?: boolean
  repo: Repository
}

const DependenciesList: React.FC<IProps> = ({ dependencies, isDev, repo }) => {
  const [packages, setPackages] = useState<{
    [key: string]: 'stable' | 'latest'
  }>({})

  const { fullName } = repo
  const items = Object.keys(packages).map(
    (key) => `${key}${packages[key] === 'latest' ? `@${packages[key]}` : ''}`,
  )

  const [showSuccess, setShowSuccess] = React.useState(false)
  const commandeLine = `yarn upgrade ${items.join(' ')}`
  const { onCopy, hasCopied } = useClipboard(commandeLine)
  const createPR = async () => {
    const res = await createUpgradePR(fullName, {
      updatedDependencies: items,
      repoId: repo.id,
    })
    setShowSuccess(true)
    console.log('createPR -> res', res)
  }

  const createPRisDisabled = items.length === 0
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
          : `yarn upgrade [pick some dependencies]`}
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

      <Flex flexDir="row-reverse">
        {!showSuccess && (
          <Button onClick={createPR} m={2} isDisabled={createPRisDisabled}>
            Create my Pull Request
          </Button>
        )}
        {showSuccess && (
          <Text color="green.500">
            Generating the pull request, it will be opened soon
          </Text>
        )}
      </Flex>
    </Box>
  )
}

export default DependenciesList
