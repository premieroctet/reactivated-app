import { Progress } from '@chakra-ui/core'
import React from 'react'

interface Props extends Pick<Repository, 'score'> {}

const HealthBar: React.FC<Props> = ({ score }) => {
  const getHealthBarColor = (score: number) => {
    let color = 'green'
    if (score < 25) {
      color = 'red'
    } else if (score < 75) {
      color = 'orange'
    }
    return color
  }

  return (
    <Progress
      color={getHealthBarColor(score)}
      size="md"
      value={score}
      width="100%"
      hasStripe
      isAnimated
    />
  )
}

export default HealthBar
