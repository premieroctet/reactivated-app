import React, { useState } from 'react'
import FormInput from '@components/FormInput'
import { Select, Input, Stack, Link, Icon, Button } from '@chakra-ui/core'

interface Props {
  branches: GithubBranch['name'][]
  repoName: string
  onSubmit: (data: { branch: string; path?: string }) => void | Promise<void>
  initialBranch?: string
  initialPath?: string
}

const RepoConfigForm: React.FC<Props> = ({
  branches,
  repoName,
  onSubmit,
  initialBranch,
  initialPath,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    if (!initialBranch) {
      const master = branches.find((branch) => branch === 'master')
      if (!master) {
        return branches[0]
      }

      return master
    }

    return initialBranch
  })
  const [mainPath, setMainPath] = useState<string>(() => {
    if (initialPath) {
      if (initialPath === '/') {
        return ''
      }

      return initialPath
    }

    return ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  const onChangeBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(e.target.value)
  }

  const onChangeMainPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainPath(e.target.value)
  }

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      await onSubmit({
        branch: selectedBranch,
        path: `${mainPath}${mainPath.endsWith('/') ? '' : '/'}`,
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitForm}>
      <Stack spacing={6}>
        <FormInput label="Select a branch" id="repo-branch" mt={4}>
          <Select size="md" onChange={onChangeBranch} value={selectedBranch}>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </Select>
        </FormInput>
        <FormInput
          label="Package.json & yarn.lock root path"
          id="package-path"
          helperText={
            <Link
              href={`https://github.com/${repoName}/tree/${selectedBranch}/${mainPath}`}
              target="_blank"
            >
              Check if package.json and yarn.lock exists in that path&nbsp;
              <Icon name="external-link" size="14px" />
            </Link>
          }
        >
          <Input
            placeholder="Root path"
            value={mainPath}
            size="md"
            onChange={onChangeMainPath}
          />
        </FormInput>
        <Button
          size="lg"
          variantColor="teal"
          type="submit"
          isLoading={submitLoading}
        >
          Finish configuration
        </Button>
      </Stack>
    </form>
  )
}

export default RepoConfigForm
