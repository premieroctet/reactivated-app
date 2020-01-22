import React from 'react'
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuButtonProps,
} from '@chakra-ui/core'

interface Props<T> extends MenuButtonProps {
  renderMenuItem: (item: T, index: number) => React.ReactElement
  renderSelected: () => React.ReactElement
  items: T[]
  keyExtractor: (item: T, index: number) => string
}

const SelectMenu = <T extends any>({
  renderMenuItem,
  renderSelected,
  items,
  keyExtractor,
  ...props
}: Props<T>) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        // @ts-ignore
        rightIcon="chevron-down"
        disabled={items.length === 0}
        {...props}
      >
        {renderSelected()}
      </MenuButton>
      <MenuList>
        {items.map((item, index) =>
          React.cloneElement(renderMenuItem(item, index), {
            key: keyExtractor(item, index),
          }),
        )}
      </MenuList>
    </Menu>
  )
}

export default SelectMenu
