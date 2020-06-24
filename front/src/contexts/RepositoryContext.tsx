import { Repository } from '@typings/entities'
import React, { useContext, useState } from 'react'
import CountUp from 'react-countup'
interface RepositoryContextInterface {
  setRepository: (repository: Repository | undefined) => void
  repository: Repository | undefined
  increasePRCount: () => void
  prCount: number
  scoreCountUp: JSX.Element
  updateScore: (newScore: number) => void
  outdatedCount: number
  score: number
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

  React.useEffect(() => {
    setCreatedCount(0)
    if (repository) {
      setScoreCountUp(<CountUp start={0} end={score} preserveValue={true} />)
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

  const increasePRCount = () => {
    setCreatedCount((prevCount) => prevCount + 1)
  }
  const updateScore = (newScore: number) => {
    setScore(newScore)
  }
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
      }}
      {...props}
    />
  )
}

export function useRepository() {
  const context = useContext(RepositoryContext)
  return context
}
