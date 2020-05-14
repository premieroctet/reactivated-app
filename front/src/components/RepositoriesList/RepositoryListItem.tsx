import { IconButton, Image, ListItem, Text } from '@chakra-ui/core'
import { Column, Row } from '@components/Flex'
import HealthBar from '@components/HealthBar/HealthBar'
import React, { memo } from 'react'
import FrameworkTag from '../FrameworkTag/FrameworkTag'

interface Props
  extends Pick<Repository, 'repoImg' | 'name' | 'score' | 'framework'> {}

const RepositoryListItem = memo(
  ({ repoImg, name, score, framework }: Props) => {
    return (
      <ListItem
        px={5}
        py={4}
        transition=".3s background-color"
        _hover={{ bg: 'gray.300' }}
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
          <Row>
            {framework !== null && <FrameworkTag framework={framework} />}
            <IconButton
              variant="ghost"
              fontSize="3xl"
              aria-label="View"
              icon="chevron-right"
            />
          </Row>
        </Row>
      </ListItem>
    )
  },
)

export default RepositoryListItem
