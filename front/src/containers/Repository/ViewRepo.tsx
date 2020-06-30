import * as RepositoriesAPI from '@api/repositories'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Code,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  useClipboard,
} from '@chakra-ui/core'
import DependenciesList from '@components/DependenciesList'
import { DependenciesProvider } from '@contexts/DependenciesContext'
import { useRepository } from '@contexts/RepositoryContext'
import { refinedDependency } from '@utils/dependencies'
import React, { useMemo } from 'react'
import { DiGitPullRequest } from 'react-icons/di'
import { createUpgradePR } from '../../api/repositories'
import { Row } from '../../components/Flex'

const MemoTabList = React.memo(
  ({
    dependenciesDisabled,
    devDependenciesDisabled,
  }: {
    dependenciesDisabled: boolean
    devDependenciesDisabled: boolean
  }) => (
    <TabList>
      <Tab disabled={dependenciesDisabled}>Dependencies</Tab>
      <Tab disabled={devDependenciesDisabled}>Dev Dependencies </Tab>
    </TabList>
  ),
)

const YarnCommandLine = React.memo(() => {
  const { items, hasSelectedDependencies } = useRepository()
  const commandeLine = `yarn upgrade ${items.join(' ')}`
  const { onCopy, hasCopied } = useClipboard(commandeLine)
  return (
    <Code
      position="relative"
      width="100%"
      rounded={10}
      whiteSpace="normal"
      my={5}
      p={5}
    >
      {hasSelectedDependencies
        ? commandeLine
        : `yarn upgrade [pick some dependencies]`}

      {hasSelectedDependencies && (
        <Button
          size="xs"
          variantColor="secondary"
          position="absolute"
          right={3}
          top={-6}
          onClick={onCopy}
        >
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      )}
    </Code>
  )
})

function ViewRepo() {
  const {
    repository,
    increasePRCount,
    onDependencySelected,
    hasSelectedDependencies,
    items,
  } = useRepository()
  const [showSuccess, setShowSuccess] = React.useState(false)

  let dependencies: Dependency[] = useMemo(() => [], [])
  let devDependencies: Dependency[] = useMemo(() => [], [])
  const devDependenciesDisabled = useMemo(() => devDependencies.length === 0, [
    devDependencies.length,
  ])
  const dependenciesDisabled = useMemo(() => dependencies.length === 0, [
    dependencies.length,
  ])

  if (!repository) {
    return null
  }

  const createPR = async () => {
    await createUpgradePR(repository.fullName, {
      updatedDependencies: items,
      repoId: repository.id,
    })

    setShowSuccess(true)
    window.scrollTo(0, 0)
    increasePRCount()
  }

  repository?.dependencies?.deps.forEach(
    (dep: DependencyArray | PrefixedDependency) => {
      if (Array.isArray(dep)) {
        const depObject = refinedDependency(dep)

        depObject.type === 'dependencies'
          ? dependencies.push(depObject)
          : devDependencies.push(depObject)
      } else {
        const prefix = Object.keys(dep)[0]
        const type = dep[prefix][0][4]

        dependencies = [
          ...dependencies,
          ...dep[prefix]
            .filter((dep) => dep[4] === type)
            .map((dep) => ({ ...refinedDependency(dep), prefix })),
        ]
      }
    },
  )

  const recomputeDeps = () => {
    return RepositoriesAPI.recomputeDeps(repository.id)
  }

  return (
    <>
      {repository.crawlError && (
        <Row py={1}>
          <Tag variantColor="red" rounded="full" size="sm" mx={1}>
            <TagLabel>Error</TagLabel>
          </Tag>
          <Text color="red.500">{`Something went wrong when fetching dependencies : ${repository.crawlError}`}</Text>
        </Row>
      )}
      <YarnCommandLine />

      <DependenciesProvider>
        {repository && repository.dependencies && repository.dependencies.deps && (
          <Box w={['100%', 'unset']} minW={['100%']} mt={4}>
            <Tabs
              defaultIndex={dependencies.length === 0 ? 1 : 0}
              isFitted
              variantColor="secondary"
              variant="line"
            >
              <MemoTabList
                dependenciesDisabled={dependenciesDisabled}
                devDependenciesDisabled={devDependenciesDisabled}
              />
              <TabPanels>
                <TabPanel>
                  <DependenciesList
                    dependencies={dependencies}
                    onDependencySelected={onDependencySelected}
                  />
                </TabPanel>
                <TabPanel>
                  <DependenciesList
                    dependencies={devDependencies}
                    onDependencySelected={onDependencySelected}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Flex
              zIndex={10}
              pos={hasSelectedDependencies ? 'sticky' : 'inherit'}
              bottom={0}
              flexDir="row-reverse"
            >
              <Button
                leftIcon={showSuccess ? 'check-circle' : DiGitPullRequest}
                onClick={createPR}
                variantColor="gray"
                isDisabled={showSuccess || !hasSelectedDependencies}
                m={2}
              >
                {showSuccess ? 'Your PR is on its way!' : 'Create Pull Request'}
              </Button>
            </Flex>
          </Box>
        )}

        {repository && !repository.dependencies && (
          <Alert status="info" mt={6}>
            <AlertIcon />
            <Stack align="flex-start">
              <AlertDescription>
                It looks like your dependencies were not computed. This might be
                due to an unexpected server error.
              </AlertDescription>
              <Button onClick={recomputeDeps}>Retry</Button>
            </Stack>
          </Alert>
        )}
      </DependenciesProvider>
    </>
  )
}

export default ViewRepo
