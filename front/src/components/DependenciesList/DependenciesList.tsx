import { Box, Text } from '@chakra-ui/core'
import React, { useMemo, useRef } from 'react'
import { useRepository } from '../../contexts/RepositoryContext'
import DependencyItem from './DependencyItem'

interface IProps {
  dependencies: Dependency[]

  onDependencySelected: (
    checked: boolean,
    name: string,
    type: 'stable' | 'latest',
  ) => void
}

const DependenciesList: React.FC<IProps> = ({
  dependencies,
  onDependencySelected,
}) => {
  const lastPrefixRef = useRef<string>()
  const { selectedDependencies } = useRepository()
  const onSelect = React.useCallback(
    (checked: boolean, name: string, type: 'stable' | 'latest'): void => {
      onDependencySelected(checked, name, type)
    },
    [onDependencySelected],
  )
  const isStableChecked = React.useCallback(
    (depName: string) => {
      return selectedDependencies[depName] === 'stable'
    },
    [selectedDependencies],
  )
  const isLatestChecked = React.useCallback(
    (depName: string) => {
      return selectedDependencies[depName] === 'latest'
    },
    [selectedDependencies],
  )

  const dependenciesItems = useMemo(() => {
    return dependencies.map((dep) => {
      const displayPrefix = lastPrefixRef.current !== dep.prefix && dep.prefix
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
            // isStableChecked={selectedDependencies[dep.name] === 'stable'}
            // isLatestChecked={selectedDependencies[dep.name] === 'latest'}
            isStableChecked={isStableChecked(dep.name)}
            isLatestChecked={isLatestChecked(dep.name)}
            onSelect={onSelect}
            dependency={dep}
          />
        </Box>
      )
    })
  }, [dependencies, isLatestChecked, isStableChecked, onSelect])
  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      <Box pt={2} w="100%">
        {dependenciesItems}
      </Box>
    </Box>
  )
}

export default React.memo(DependenciesList)
