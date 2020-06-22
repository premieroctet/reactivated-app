import React, { memo } from 'react'
import {
  IconButton,
  Image,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/core'
import { Column, Row } from '@components/Flex'
import FrameworkTag from '../FrameworkTag/FrameworkTag'
import LoadScore from '@components/LoadScore'
import LoadBar from '@components/LoadBar'
import { Repository } from '../../typings/entities'
import { motion } from 'framer-motion'
import { IoIosBuild } from 'react-icons/io'
import RepoConfigForm from '../RepoConfigForm'
import * as RepositoriesAPI from '@api/repositories'
import { mutate } from 'swr'
import useChakraToast from '../../hooks/useChakraToast'
interface IProps {
  repository: Repository
}

const RepositoryListItem = memo(({ repository }: IProps) => {
  const isConfiguredOpacity = repository.isConfigured ? 1 : 0.5

  const {
    isOpen: configModalOpen,
    onOpen: openConfigModal,
    onClose: closeConfigModal,
  } = useDisclosure()

  const [branches, setBranches] = React.useState<GithubBranch[]>([])
  const toast = useChakraToast()

  const onConfigureRepo = async () => {
    try {
      const res = await RepositoriesAPI.getRepositoryBranches(
        repository.fullName,
      )
      setBranches(res.data)
      openConfigModal()
    } catch (error) {
      toast({
        title: 'An error occured',
        status: 'error',
        description: "Can't find branches on the selected repository",
      })
    }
  }

  const onUpdateConfig = async (config: { branch: string; path: string }) => {
    try {
      const { data: configData } = await RepositoriesAPI.configureRepository({
        id: repository.id,
        data: { ...config, fullName: repository!.fullName },
      })
      mutate([repository.id], configData)

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

  return (
    <Flex
      position="relative"
      cursor={repository.isConfigured ? 'pointer' : 'auto'}
      rounded={10}
      shadow="md"
      bg={'white'}
      mb={4}
      px={5}
      py={8}
      overflow="hidden"
    >
      {repository.score > 0 && <LoadBar score={repository.score} />}
      <Flex flexDirection="column" width="100%">
        <Flex
          zIndex={10}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Row justifyContent="center" opacity={isConfiguredOpacity}>
            <Image
              size={16}
              borderRadius={40}
              src={repository.repoImg}
              alt={repository.name}
            />
            <Column alignItems="flex-start" ml={5}>
              <Text as="span" fontSize="2xl" fontWeight="semibold">
                {repository.name}
              </Text>
              {repository.framework !== null && repository.isConfigured ? (
                <FrameworkTag framework={repository.framework} />
              ) : (
                <div>
                  Configuration in progress
                  {Array.from(Array(3).keys()).map((value) => {
                    return (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          ease: 'easeInOut',
                          duration: 1,
                          delay: value / 2,
                          yoyo: Infinity,
                        }}
                        key={value}
                      >
                        .
                      </motion.span>
                    )
                  })}
                </div>
              )}
            </Column>
          </Row>

          <Row alignItems="center">
            {repository.score > 0 ? (
              <>
                <LoadScore score={repository.score} />
                <IconButton
                  variant="ghost"
                  fontSize="3xl"
                  aria-label="View"
                  icon="chevron-right"
                />
              </>
            ) : (
              <IconButton
                variant="ghost"
                fontSize="2xl"
                aria-label="Configure"
                icon={IoIosBuild}
                onClick={onConfigureRepo}
              />
            )}
          </Row>
        </Flex>
      </Flex>

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
              branches={branches.map((branch) => branch.name) || []}
              allowDelete
              repoId={repository.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
})

export default RepositoryListItem
