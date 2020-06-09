import React, { useContext, useState } from 'react'
import { Repository } from '@typings/entities'

interface RepositoryContextInterface {
  setRepository: (repository: Repository | undefined) => void
  repository: Repository | undefined
  increasePRCount: () => void
  prCount: number
}

const RepositoryContext = React.createContext<RepositoryContextInterface>({
  setRepository: () => null,
  repository: undefined,
  prCount: 0,
  increasePRCount: () => null,
})

interface Props {
  children: React.ReactNode
}

export function RepositoryProvider(props: Props) {
  const [repository, setRepository] = useState<Repository | undefined>()
  const [prCount, setCreatedCount] = useState<number>(0)

  const increasePRCount = () => {
    setCreatedCount((prevCount) => prevCount + 1)
  }

  return (
    <RepositoryContext.Provider
      value={{ repository, setRepository, increasePRCount, prCount }}
      {...props}
    />
  )
}

export function useRepository() {
  const context = useContext(RepositoryContext)
  return context
}
