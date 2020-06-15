import { Box, Text } from '@chakra-ui/core'
import React, { useRef } from 'react'
import DependencyItem from './DependencyItem'

interface IProps {
  dependencies: Dependency[]
  selectedDependencies: {
    [key: string]: 'stable' | 'latest'
  }
  onDependencySelected: (
    checked: boolean,
    name: string,
    type: 'stable' | 'latest',
  ) => void
}

const DependenciesList: React.FC<IProps> = ({
  dependencies,
  selectedDependencies,
  onDependencySelected,
}) => {
  const lastPrefixRef = useRef<string>()

  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      <Box pt={2} w="100%">
        {dependencies.map((dep) => {
          const displayPrefix =
            lastPrefixRef.current !== dep.prefix && dep.prefix
          if (dep.prefix) {
            lastPrefixRef.current = dep.prefix
          }

          return (
            <Box key={dep.name}>
              {displayPrefix && (
                <Text fontWeight="bold" pt={4} pb={1}>
                  {dep.prefix}
                </Text>
              )}
              <DependencyItem
                isStableChecked={selectedDependencies[dep.name] === 'stable'}
                isLatestChecked={selectedDependencies[dep.name] === 'latest'}
                onSelect={(checked, name, type) => {
                  onDependencySelected(checked, name, type)
                }}
                dependency={dep}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default DependenciesList
