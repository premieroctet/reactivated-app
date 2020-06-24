import { Box } from '@chakra-ui/core'
import { motion } from 'framer-motion'
import React from 'react'
import { Repository } from '../typings/entities'

interface Props extends Pick<Repository, 'score'> {}

const MotionBox = motion.custom(Box)
const LoadBar: React.FC<Props> = ({ score }) => {
  return (
    <Box
      bg="brand.50"
      position="absolute"
      bottom={0}
      height={1}
      left={0}
      right={0}
      zIndex={0}
    >
      <MotionBox
        bg="brand.500"
        position="absolute"
        bottom={0}
        height={1}
        left={0}
        transition="width 300ms"
        width={`${score === 100 ? score - 1 : score}%`}
        zIndex={0}
        animate
      />
      <MotionBox
        shadow="lg"
        position="absolute"
        bottom={0}
        height={1}
        width={2}
        bg="brand.500"
        boxShadow="2px 1px 6px 3px rgba(71,253,167,0.6)"
        left={`${score === 100 ? score - 1 : score}%`}
        zIndex={20}
        animate
      />
    </Box>
  )
}

export default LoadBar
