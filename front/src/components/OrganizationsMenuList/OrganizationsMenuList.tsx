import React, { memo } from 'react'
import SelectMenu from '@components/SelectMenu'
import OrganizationMenuItem from './OrganizationMenuItem'
import { Row } from '@components/Flex'

interface Props {
  orgs: GithubAccount[]
  onSelect: (account: GithubAccount) => void
  selectedOrg: GithubAccount
}

const OrganizationsMenuList: React.FC<Props> = memo(
  ({ orgs, onSelect, selectedOrg }) => {
    const keyExtractor = (item: GithubAccount) => {
      return item.id.toString()
    }

    const renderItem = (item: GithubAccount) => {
      return <OrganizationMenuItem {...item} onPress={onSelect} />
    }

    const renderSelected = () => {
      return (
        <OrganizationMenuItem
          {...selectedOrg}
          as={Row}
          py={0}
          alignItems="center"
        />
      )
    }

    return (
      <SelectMenu<GithubAccount>
        items={orgs}
        keyExtractor={keyExtractor}
        renderMenuItem={renderItem}
        renderSelected={renderSelected}
      />
    )
  },
)

export default OrganizationsMenuList
