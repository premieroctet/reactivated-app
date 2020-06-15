import React from 'react'
import Sticky from 'react-stickynode'
import {
  Flex,
  Stack,
  Box,
  Heading,
  Icon,
  Link,
  Text,
  Image,
} from '@chakra-ui/core'
import LoadBar from './LoadBar'
import FrameworkTag from './FrameworkTag/FrameworkTag'
import { formatDistance } from 'date-fns'
import { FaGithub } from 'react-icons/fa'
import { motion } from 'framer-motion'
import LoadScore from './LoadScore'
import Container from '@components/Container'
import { Repository } from '@typings/entities'

const MotionImage = motion.custom(Image)
const MotionContainer = motion.custom(Container)
const MotionLoadScore = motion.custom(LoadScore)

interface IProps {
  repository: Repository
}

const AppHeader: React.FC<IProps> = ({ repository }) => {
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
              <LoadBar score={repository.score} />
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
                <Box backgroundColor="yellow">
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
              </Stack>
              <MotionLoadScore
                animate
                isSmall={isSticky}
                score={repository.score}
              />
            </Flex>
          </MotionContainer>
        )
      }}
    </Sticky>
  )
}

export default AppHeader
