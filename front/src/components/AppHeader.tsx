import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/core'
import Container from '@components/Container'
import { Repository } from '@typings/entities'
import { formatDistance } from 'date-fns'
import { motion } from 'framer-motion'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import Sticky from 'react-stickynode'
import { useRepository } from '../contexts/RepositoryContext'
import FrameworkTag from './FrameworkTag/FrameworkTag'
import LoadBar from './LoadBar'
import LoadScore from './LoadScore'

const MotionImage = motion.custom(Image)
const MotionContainer = motion.custom(Container)
const MotionLoadScore = motion.custom(LoadScore)

interface IProps {
  repository: Repository
}

const AppHeader: React.FC<IProps> = ({ repository }) => {
  const { score } = useRepository()

  const RepoDetails = React.memo(
    ({
      isSticky,
      repository,
    }: {
      isSticky: boolean
      repository: Repository
    }) => {
      return (
        <Box>
          <Heading fontSize="2xl">{repository.name}</Heading>

          {!isSticky && (
            <Stack alignItems="center" mb={2} isInline>
              <Box display="flex" justifyContent="space-between">
                {repository?.framework !== null && (
                  <FrameworkTag framework={repository.framework} />
                )}
              </Box>

              <Text fontSize="sm">
                <Icon name="repeat" />{' '}
                {formatDistance(
                  new Date(repository.dependenciesUpdatedAt),
                  new Date(),
                  { addSuffix: false },
                )}
              </Text>
            </Stack>
          )}

          <Link
            borderTop="1px dashed"
            borderTopColor="gray.300"
            pt={isSticky ? 0 : 2}
            fontSize="sm"
            display="flex"
            alignItems="center"
            isExternal
            href={`https://github.com/${repository.fullName}`}
          >
            <Box as={FaGithub} mr={1} /> {repository.fullName}
          </Link>
        </Box>
      )
    },
  )

  return (
    <Sticky innerZ={40} top={10}>
      {(status) => {
        const isSticky = status.status === Sticky.STATUS_FIXED

        return (
          <MotionContainer
            animate
            py={[2, isSticky ? 1 : 5]}
            px={[2, 5]}
            roundedBottom={isSticky ? 0 : 10}
          >
            <Flex pr={10} justifyContent="space-between" my={4}>
              <LoadBar score={score} />
              <Stack isInline spacing={4}>
                <Link isExternal href={repository.repoUrl}>
                  <MotionImage
                    rounded={100}
                    src={repository.repoImg}
                    alt={repository.name}
                    size={[16, isSticky ? 10 : 24]}
                    animate
                  />
                </Link>

                <RepoDetails isSticky={isSticky} repository={repository} />
              </Stack>

              <MotionLoadScore animate isSmall={isSticky} score={score} />
            </Flex>
          </MotionContainer>
        )
      }}
    </Sticky>
  )
}

export default AppHeader
