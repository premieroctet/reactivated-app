import React, { memo } from 'react'
import { ListItem, Image, Text } from '@chakra-ui/core'
import nextImg from '@assets/img/next.png'
import { Row, Column } from '@components/Flex'

interface Props extends Pick<Repository, 'repoImg' | 'name' | 'author'> {
  bordered?: boolean
}

const RepositoryListItem = memo(
  ({ repoImg, name, author, bordered }: Props) => {
    return (
      <ListItem
        borderBottom={bordered ? '1px solid rgb(223, 223, 223)' : undefined}
        px={5}
        py={4}
        transition=".3s background-color"
        _hover={{ bg: 'gray.100' }}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center" justifyContent="center">
            <Image size={16} borderRadius={5} src={repoImg} alt="repo-icon" />
            <Column alignItems="flex-start" ml={5}>
              <Text as="span" fontSize="lg">
                {name}
              </Text>
              <Text
                as="span"
                fontSize={['xs', 'xs', 'sm', 'lg']}
                color="rgb(114, 114, 114)"
              >
                created by <b>{author}</b>
              </Text>
            </Column>
          </Row>
          <Image w={27} h={27} src={nextImg} alt="repo-icon" />
        </Row>
      </ListItem>
    )
  },
)

export default RepositoryListItem
