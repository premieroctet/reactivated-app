import React, { memo } from 'react'
import { IconButton, Image, Text, Flex } from '@chakra-ui/core'
import { Column, Row } from '@components/Flex'
import FrameworkTag from '../FrameworkTag/FrameworkTag'
import LoadScore from '@components/LoadScore'
import LoadBar from '@components/LoadBar'
import { Repository } from '../../typings/entities'

interface IProps {
  repository: Repository
}

const RepositoryListItem = memo(({ repository }: IProps) => {
  return (
    <Flex
      position="relative"
      cursor="pointer"
      rounded={10}
      shadow="md"
      bg="white"
      mb={4}
      px={5}
      py={8}
      overflow="hidden"
    >
      <LoadBar score={repository.score} />
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
              {repository.framework !== null && (
                <FrameworkTag framework={repository.framework} />
              )}
            </Column>
          </Row>

          <Row alignItems="center">
            {repository.score && <LoadScore score={repository.score} />}

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
