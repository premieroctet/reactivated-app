import React, { useState, useEffect } from 'react'
import { Stack, Box, Badge, BoxProps } from '@chakra-ui/core'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router'
import { useRepository } from '@contexts/RepositoryContext'

interface IProps {
  outdatedCount?: number
  pullRequestCount: number
  repositoryId: number
  activeTabName: 'dependencies' | 'pr'
}

interface ITabProps {
  isActive?: boolean
}

const Tab: React.FC<ITabProps & BoxProps> = ({ isActive, ...rest }) => (
  <Box
    cursor="pointer"
    pos="relative"
    py={3}
    px={4}
    roundedTop={10}
    bg={isActive ? 'white' : 'transparent'}
    shadow={isActive ? 'md' : 'none'}
    fontWeight={isActive ? 'bold' : 'normal'}
    fontSize="md"
    {...rest}
  />
)

const MotionBadge = motion.custom(Badge)

const AppBar = React.forwardRef<HTMLDivElement, IProps>(
  ({ outdatedCount, pullRequestCount, repositoryId, activeTabName }, ref) => {
    const history = useHistory()
    const { prCount } = useRepository()
    const [isAnimated, setIsAnimated] = useState(false)

    useEffect(() => {
      if (prCount > 0) {
        setIsAnimated(true)
        setTimeout(() => {
          setIsAnimated(false)
        }, 1200)
      }
    }, [prCount])

    const navigate = () => {
      history.push(`/repo/${repositoryId}`)
    }
    return (
      <Stack isInline ref={ref}>
        <Tab onClick={navigate} isActive={activeTabName === 'dependencies'}>
          {outdatedCount ? (
            <>
              Outdated Dependencies{' '}
              <Badge fontSize="xs" variantColor="red">
                {outdatedCount}
              </Badge>
            </>
          ) : (
            <>Dependencies Outdated</>
          )}
        </Tab>
        <Tab
          isActive={activeTabName === 'pr'}
          onClick={() => {
            history.push(`/repo/${repositoryId}/pull-requests`)
          }}
        >
          Pull Requests{' '}
          <MotionBadge
            animate
            zIndex={30}
            pos={isAnimated ? 'absolute' : 'relative'}
            fontSize={isAnimated ? '3xl' : 'xs'}
            shadow={isAnimated ? 'xl' : 'none'}
            variantColor={isAnimated ? 'yellow' : 'brand'}
            top={0}
          >
            {pullRequestCount + prCount}
          </MotionBadge>
        </Tab>
      </Stack>
    )
  },
)

export default React.memo(AppBar)
