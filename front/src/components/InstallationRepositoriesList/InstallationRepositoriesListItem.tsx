import React, { memo } from 'react'
import { Row } from '@components/Flex'
import { Box, Text, Icon, ListItem, Spinner } from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'

interface Props extends GithubInstallationRepository {
  onSelect: (id: GithubInstallationRepository['id']) => void
}

const InstallationRepositoriesListItem: React.FC<Props> = memo(
  ({ fullName, private: isPrivate, id, onSelect, ...props }) => {
    const [loading, setLoading] = React.useState(false)

    const onPress = () => {
      setLoading(true)
      onSelect(id)
    }

    return (
      <ListItem
        onClick={onPress}
        _hover={{ cursor: 'pointer', bg: 'gray.200' }}
        transition=".3s background-color"
        px={2}
        {...props}
      >
        <Row align="center" py={1} justify="space-between">
          <Row align="center">
            {loading ? (
              <Spinner mr={4} w="32px" h="32px" speed="1.15s" />
            ) : (
              <Box as={FaGithub} size="32px" mr={4} color="black" />
            )}
            <Text as="span" fontWeight="semibold">
              {fullName}
            </Text>
          </Row>
          <Row align="center">
            {isPrivate && (
              <Row align="center" color="gray.400" mr={2}>
                <Icon name="lock" mr={1} size="18px" />
                <Text as="span" fontWeight="semibold">
                  Private
                </Text>
              </Row>
            )}
            <Icon name="chevron-right" color="gray.400" size="24px" />
          </Row>
        </Row>
      </ListItem>
    )
  },
)

export default InstallationRepositoriesListItem
