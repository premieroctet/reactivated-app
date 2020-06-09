import {
  Button,
  Icon,
  Input,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
  Text,
} from '@chakra-ui/core'
import FormInput from '@components/FormInput'
import React, { useState } from 'react'
import { deleteRepository } from '../../api/repositories'
import { Row } from '../Flex'

interface Props {
  branches: GithubBranch['name'][]
  repoName: string
  onSubmit: (data: { branch: string; path: string }) => void | Promise<void>
  initialBranch?: string
  initialPath?: string
  allowDelete?: boolean
  repoId?: number
}

const RepoConfigForm: React.FC<Props> = ({
  branches,
  repoName,
  onSubmit,
  initialBranch,
  initialPath,
  allowDelete,
  repoId,
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
  const [deleteLoading, setDeleteLoading] = React.useState(false)

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

  const onDeleteRepo = async () => {
    if (repoId) {
      const res = await deleteRepository(repoId)
      if (res.status === 200) {
        console.log('onDeleteRepo -> res.status', res.status)
        setDeleteLoading(true)
        setTimeout(() => {
          window.location.assign('/')
        }, 800)
      }
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
          variantColor="secondary"
          type="submit"
          rightIcon="check"
          isLoading={submitLoading}
        >
          Finish configuration
        </Button>

        {allowDelete && (
          <Popover>
            <PopoverTrigger>
              <Button variantColor="red" variant="link">
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                <Text color="red.500">Confirm deletion</Text>
              </PopoverHeader>
              <PopoverBody>
                Are you sure to delete <b>{repoName}</b>?
                <Row justify="center" mt={5}>
                  <Button
                    variantColor="red"
                    onClick={onDeleteRepo}
                    isLoading={deleteLoading}
                  >
                    Confirm
                  </Button>
                </Row>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Stack>
    </form>
  )
}

export default RepoConfigForm
