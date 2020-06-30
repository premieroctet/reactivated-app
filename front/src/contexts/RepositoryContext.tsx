import { Repository } from '@typings/entities'
import React, { useContext, useState } from 'react'
import CountUp from 'react-countup'
import { getNewScore } from '../utils/dependencies'
interface RepositoryContextInterface {
  setRepository: (repository: Repository | undefined) => void
  repository: Repository | undefined
  increasePRCount: () => void
  prCount: number
  scoreCountUp: JSX.Element
  updateScore: (newScore: number) => void
  outdatedCount: number
  score: number
  selectedDependencies: {
    [key: string]: 'stable' | 'latest'
  }
  onDependencySelected: (
    checked: boolean,
    name: string,
    type: 'stable' | 'latest',
  ) => void
  items: string[]
  hasSelectedDependencies: boolean
}

const RepositoryContext = React.createContext<RepositoryContextInterface>({
  setRepository: () => null,
  repository: undefined,
  prCount: 0,
  increasePRCount: () => null,
  scoreCountUp: <></>,
  updateScore: () => null,
  outdatedCount: 0,
  score: 0,
  selectedDependencies: {},
  onDependencySelected: () => null,
  items: [],
  hasSelectedDependencies: false,
})

interface Props {
  children: React.ReactNode
}

export function RepositoryProvider(props: Props) {
  const [repository, setRepository] = useState<Repository | undefined>()
  const [prCount, setCreatedCount] = useState<number>(0)
  const [score, setScore] = React.useState<number>(0)
  const [outdatedCount, setOutdatedCount] = React.useState<number>(0)
  const [scoreCountUp, setScoreCountUp] = React.useState<JSX.Element>(<></>)
  const [selectedDependencies, setSelectedDependencies] = useState<{
    [key: string]: 'stable' | 'latest'
  }>({})
  const [hasSelectedDependencies, setHasSelectedDependencies] = React.useState<
    boolean
  >(false)

  const items = Object.keys(selectedDependencies).map(
    (key) =>
      `${key}${
        selectedDependencies[key] === 'latest'
          ? `@${selectedDependencies[key]}`
          : ''
      }`,
  )
  const increasePRCount = () => {
    setCreatedCount((prevCount) => prevCount + 1)
  }
  const updateScore = (newScore: number) => {
    setScore(newScore)
  }
  const onDependencySelected = React.useCallback(
    (checked: boolean, name: string, type: 'stable' | 'latest') => {
      if (checked) {
        setSelectedDependencies({ ...selectedDependencies, [name]: type })
      } else {
        const { [name]: omit, ...rest } = selectedDependencies
        setSelectedDependencies({ ...rest })
      }
    },
    [selectedDependencies],
  )

  React.useEffect(() => {
    const nbSelectedDependencies = Object.keys(selectedDependencies).length
    if (Boolean(nbSelectedDependencies > 0) !== hasSelectedDependencies) {
      setHasSelectedDependencies(nbSelectedDependencies > 0)
    }
    const newScore = getNewScore(
      nbSelectedDependencies,
      outdatedCount,
      repository?.packageJson,
    )
    updateScore(newScore)
  }, [hasSelectedDependencies, outdatedCount, repository, selectedDependencies])

  React.useEffect(() => {
    setCreatedCount(0)
    if (repository) {
      const newScore = score > repository.score ? score : repository.score
      setScoreCountUp(<CountUp start={0} end={newScore} preserveValue={true} />)
      setOutdatedCount(
        repository.dependencies!.deps.reduce(
          (outdatedCount, dep: object | string[], i) => {
            if (Array.isArray(dep)) {
              return outdatedCount + 1
            }

            return outdatedCount + Object.values(dep)[0].length
          },
          0,
        ),
      )
    }
  }, [repository, score])

  return (
    <RepositoryContext.Provider
      value={{
        repository,
        setRepository,
        increasePRCount,
        prCount,
        scoreCountUp,
        outdatedCount,
        updateScore,
        score,
        selectedDependencies,
        onDependencySelected,
        items,
        hasSelectedDependencies,
      }}
      {...props}
    />
  )
}

export function useRepository() {
  const context = useContext(RepositoryContext)
  return context
}
