import React, { memo } from 'react'
import { MenuItem, Image, Text, MenuItemProps } from '@chakra-ui/core'

interface Props extends GithubAccount, Omit<MenuItemProps, 'id'> {
  onPress?: (account: GithubAccount) => void
  as?: React.ComponentType
}

const OrganizationMenuItem: React.FC<Props> = memo(
  ({ onPress, id, login, avatarUrl, as: Comp = MenuItem, ...props }) => {
    const onSelect = () => {
      if (onPress) {
        onPress({ id, login, avatarUrl })
      }
    }

    return (
      <Comp onClick={onSelect} py={1} {...props}>
        <Image size="2rem" rounded="full" src={avatarUrl} alt={login} mr={4} />
        <Text as="span" fontWeight="semibold">
          {login}
        </Text>
      </Comp>
    )
  },
)

export default OrganizationMenuItem
