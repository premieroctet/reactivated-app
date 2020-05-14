import React, { memo } from 'react'
import { ListItem, Image, Text, IconButton } from '@chakra-ui/core'
import { Row, Column } from '@components/Flex'
import HealthBar from '@components/HealthBar/HealthBar'

interface Props extends Pick<Repository, 'repoImg' | 'name' | 'score'> {}

const RepositoryListItem = memo(({ repoImg, name, score }: Props) => {
  return (
    <ListItem
      px={5}
      py={4}
      transition=".3s background-color"
      _hover={{ bg: 'gray.100' }}
    >
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" justifyContent="center">
          <Image size={16} borderRadius={5} src={repoImg} alt="repo-icon" />
          <Column alignItems="flex-start" ml={5}>
            <Text as="span" fontSize="lg" fontWeight="semibold">
              {name}
            </Text>
            <HealthBar score={score} />
          </Column>
        </Row>
        <IconButton
          variant="ghost"
          fontSize="3xl"
          aria-label="View"
          icon="chevron-right"
        />
      </Row>
    </ListItem>
  )
})

export default RepositoryListItem
