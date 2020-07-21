import React from 'react'
import { Tabs, TabPanels, TabPanel } from '@chakra-ui/core'
import { DependenciesTypeTabs } from '@containers/Repository/ViewRepo'
import DependenciesList from '@components/DependenciesList'

interface IProps {
  dependencies: Dependency[]
  devDependencies: Dependency[]
  onDependencySelected: (
    checked: boolean,
    name: string,
    type: 'stable' | 'latest',
  ) => void
  selectedDependencies: {
    [key: string]: 'stable' | 'latest'
  }
}

const DependencyTabs: React.FC<IProps> = ({
  dependencies,
  devDependencies,
  onDependencySelected,
  selectedDependencies,
}) => {
  return (
    <Tabs
      defaultIndex={dependencies.length === 0 ? 1 : 0}
      isFitted
      variantColor="secondary"
      variant="line"
    >
      <DependenciesTypeTabs
        dependencies={dependencies}
        devDependencies={devDependencies}
      />

      <TabPanels>
        <TabPanel>
          <DependenciesList
            dependencies={dependencies}
            selectedDependencies={selectedDependencies}
            onDependencySelected={onDependencySelected}
          />
        </TabPanel>
        <TabPanel>
          <DependenciesList
            onDependencySelected={onDependencySelected}
            dependencies={devDependencies}
            selectedDependencies={selectedDependencies}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default DependencyTabs
