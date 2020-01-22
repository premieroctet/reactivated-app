import React from 'react'
import { List } from '@chakra-ui/core'
import InstallationRepositoriesListItem from './InstallationRepositoriesListItem'

interface Props {
  repositories: GithubInstallationRepository[]
  onSelect: (id: GithubInstallationRepository['id']) => void
}

const InstallationRepositoriesList: React.FC<Props> = ({
  repositories,
  onSelect,
}) => {
  return (
    <List spacing={2}>
      {repositories.map((repo) => (
        <InstallationRepositoriesListItem
          key={repo.id}
          {...repo}
          onSelect={onSelect}
        />
      ))}
    </List>
  )
}

export default InstallationRepositoriesList
