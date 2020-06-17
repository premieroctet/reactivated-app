import * as RepositoriesAPI from '@api/repositories'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/core'
import Container from '@components/Container'
import RepoConfigForm from '@components/RepoConfigForm'
import useChakraToast from '@hooks/useChakraToast'
import { useAxiosRequest } from '@hooks/useRequest'
import React from 'react'
import { Link, useRouteMatch, RouteProps } from 'react-router-dom'
import { mutate } from 'swr'
import ViewRepoSkeleton from './ViewRepoSkeleton'
import { Repository } from '../../typings/entities'
import AppBar from '@components/AppBar'
import AppHeader from '@components/AppHeader'
import { useLocation } from 'react-router'
import { useRepository } from '@contexts/RepositoryContext'

const RepositoryLayout: React.FC<RouteProps> = ({ children }) => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()

  const location = useLocation()
  const toast = useChakraToast()

  const { setRepository } = useRepository()
  const { data: repository } = useAxiosRequest<Repository>([id], {
    fetcher: RepositoriesAPI.getRepository,
    revalidateOnFocus: true,
  })

  setRepository(repository)

  // Load repository
  const { data: branches, error: branchesError } = useAxiosRequest<
    GithubBranch[]
  >(`branches-${repository?.githubId}`, {
    fetcher: () => RepositoriesAPI.getRepositoryBranches(repository!.fullName),
    revalidateOnFocus: false,
  })

  const {
    isOpen: configModalOpen,
    onOpen: openConfigModal,
    onClose: closeConfigModal,
  } = useDisclosure()

  const onUpdateConfig = async (config: { branch: string; path: string }) => {
    try {
      const { data: configData } = await RepositoriesAPI.configureRepository({
        id: parseInt(id, 10),
        data: { ...config, fullName: repository!.fullName },
      })
      mutate([id], configData)

      closeConfigModal()
      toast({
        status: 'success',
        title: 'Success !',
        description: "Successfully updated your repository's configuration",
      })
    } catch (e) {
      toast({
        title: 'An error occured',
        status: 'error',
        description: 'Please check the package.json & yarn.lock path is valid.',
      })
      throw e
    }
  }

  const outdatedCount = repository?.dependencies?.deps.reduce(
    (outdatedCount, dep: object | string[], i) => {
      if (Array.isArray(dep)) {
        return outdatedCount + 1
      }

      return outdatedCount + Object.values(dep)[0].length
    },
    0,
  )

  return (
    <>
      <Flex justifyContent="space-between">
        <Link to="/">
          <Button
            leftIcon="chevron-left"
            variant="ghost"
            variantColor="brand"
            mb={4}
          >
            Dashboard
          </Button>
        </Link>
        <Button
          leftIcon="settings"
          variant="ghost"
          variantColor="brand"
          onClick={openConfigModal}
          isDisabled={!!branchesError}
          isLoading={!branches}
        >
          Settings
        </Button>
      </Flex>

      {!repository ? (
        <ViewRepoSkeleton />
      ) : (
        <>
          <AppHeader repository={repository} />
          <AppBar
            activeTabName={
              location.pathname.includes('pull-requests')
                ? 'pr'
                : 'dependencies'
            }
            repositoryId={repository.id}
            pullRequestCount={repository.pullRequests.length}
            outdatedCount={outdatedCount}
          />

          <Container
            roundedTopLeft={
              location.pathname.includes('pull-requests') ? 10 : 0
            }
            pb={4}
          >
            {children}
          </Container>

          <Modal isOpen={configModalOpen} onClose={closeConfigModal} isCentered>
            <ModalOverlay />
            <ModalContent pb={4} rounded={10}>
              <ModalHeader>Update repository configuration</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RepoConfigForm
                  repoName={repository.fullName}
                  initialBranch={repository.branch}
                  initialPath={repository.path}
                  onSubmit={onUpdateConfig}
                  branches={branches?.map((branch) => branch.name) || []}
                  allowDelete
                  repoId={repository.id}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  )
}

export default RepositoryLayout
