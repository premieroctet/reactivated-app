import React, { memo } from 'react'
import { IconButton, Image, Text, Flex } from '@chakra-ui/core'
import { Column, Row } from '@components/Flex'
import FrameworkTag from '../FrameworkTag/FrameworkTag'
import LoadScore from '@components/LoadScore'
import LoadBar from '@components/LoadBar'
import { Repository } from '../../typings/entities'
import { motion } from 'framer-motion'

interface IProps {
  repository: Repository
}

const RepositoryListItem = memo(({ repository }: IProps) => {
  const isConfiguredOpacity = repository.isConfigured ? 1 : 0.5

  return (
    <Flex
      position="relative"
      cursor={repository.isConfigured ? 'pointer' : 'auto'}
      rounded={10}
      shadow="md"
      bg="white"
      mb={4}
      px={5}
      py={8}
      overflow="hidden"
      opacity={isConfiguredOpacity}
    >
      {repository.score > 0 && <LoadBar score={repository.score} />}
      <Flex flexDirection="column" width="100%">
        <Flex
          zIndex={10}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Row justifyContent="center">
            <Image
              size={16}
              borderRadius={40}
              src={repository.repoImg}
              alt={repository.name}
            />
            <Column alignItems="flex-start" ml={5}>
              <Text as="span" fontSize="2xl" fontWeight="semibold">
                {repository.name}
              </Text>
              {repository.framework !== null && repository.isConfigured ? (
                <FrameworkTag framework={repository.framework} />
              ) : (
                <div>
                  Configuration in progress
                  {Array.from(Array(3).keys()).map((value) => {
                    return (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          ease: 'easeInOut',
                          duration: 1,
                          delay: value / 2,
                          yoyo: Infinity,
                        }}
                        key={value}
                      >
                        .
                      </motion.span>
                    )
                  })}
                </div>
              )}
            </Column>
          </Row>

          <Row alignItems="center">
            {repository.score > 0 && <LoadScore score={repository.score} />}

            <IconButton
              variant="ghost"
              fontSize="3xl"
              aria-label="View"
              icon="chevron-right"
            />
          </Row>
        </Flex>
      </Flex>
    </Flex>
  )
})

export default RepositoryListItem
