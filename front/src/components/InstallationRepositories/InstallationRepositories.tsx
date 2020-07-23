import React, { useMemo, useState } from 'react'
import { Row, Column } from '@components/Flex'
import OrganizationsMenuList from '@components/OrganizationsMenuList'
import { Box } from '@chakra-ui/core'
import InstallationRepositoriesList from '@components/InstallationRepositoriesList'

interface Props {
  installations: GithubInstallation[]
  onSelectRepo: (fullName: string) => void
}

const InstallationRepositories: React.FC<Props> = ({
  installations,
  onSelectRepo,
}) => {
  const owners = useMemo(() => {
    return installations.map((installation) => installation.owner)
  }, [installations])
  const [selectedOwner, setSelectedOwner] = useState<GithubAccount>(owners[0])

  const onSelectOwner = (owner: GithubAccount) => {
    if (owner.id !== selectedOwner.id) {
      setSelectedOwner(owner)
    }
  }

  const repos = useMemo(() => {
    const installation = installations.find(
      (install) => install.owner.id === selectedOwner.id,
    )

    return installation?.repositories || []
  }, [installations, selectedOwner])

  const onSelectRepository = (id: GithubInstallationRepository['id']) => {
    const repo = repos.find((repo) => repo.id === id)

    if (repo) {
      onSelectRepo(repo.fullName)
    }
  }

  return (
    <Column w="100%">
      <Row justify="space-between">
        <OrganizationsMenuList
          orgs={owners.filter((owner) => owner.id !== selectedOwner.id)}
          selectedOrg={selectedOwner}
          onSelect={onSelectOwner}
        />
      </Row>
      <Box pt={4}>
        <InstallationRepositoriesList
          repositories={repos}
          onSelect={onSelectRepository}
        />
      </Box>
    </Column>
  )
}

export default InstallationRepositories
