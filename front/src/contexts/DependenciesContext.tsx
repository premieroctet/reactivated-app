import React, { useContext, useState } from 'react'

type TDep = { [key: string]: 'stable' | 'latest' }

interface DependenciesContextInterface {
  setDependencies: (item: TDep) => void
  dependencies: TDep | null
}

const DependenciesContext = React.createContext<DependenciesContextInterface>({
  setDependencies: () => null,
  dependencies: null,
})

interface Props {
  children: React.ReactNode
}

function DependenciesProvider(props: Props) {
  const [dependencies, setDependencies] = useState<TDep>({})

  return (
    <DependenciesContext.Provider
      value={{ dependencies, setDependencies }}
      {...props}
    />
  )
}

function useDependencies() {
  const context = useContext(DependenciesContext)
  return context
}

export { DependenciesProvider, useDependencies }
