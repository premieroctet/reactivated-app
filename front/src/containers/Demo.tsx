// @ts-nocheck
import {
  Box,
  Button,
  Code,
  Flex,
  FormLabel,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useClipboard,
} from '@chakra-ui/core'
import DependenciesList from '@components/DependenciesList'
import { DependenciesProvider } from '@contexts/DependenciesContext'
import { getNewScore, refinedDependency } from '@utils/dependencies'
import React, { useMemo, useState } from 'react'
import { DiGitPullRequest } from 'react-icons/di'
import { useLocation } from 'react-router'
import Container from '../components/Container'
import AppHeaderDemo from '../components/Demo/AppHeaderDemo'
import { reactRepo } from '../components/Demo/model'
import Header from '../components/Header'
import { FaGithub } from 'react-icons/fa'

function SelectAllButton({
  selectAllChecked,
  onSelectAllDependencies,
}: {
  selectAllChecked: boolean
  onSelectAllDependencies: () => void
}) {
  return (
    <Flex justifyContent="flex-end" alignItems="center" flexDirection="row">
      <FormLabel cursor="pointer" htmlFor="select-all">
        Update all dependencies
      </FormLabel>
      <Switch
        color="secondary"
        size="sm"
        id="select-all"
        isChecked={selectAllChecked}
        onChange={onSelectAllDependencies}
      />
    </Flex>
  )
}
const SelectAll = React.memo(SelectAllButton)

function Demo() {
  const repository = reactRepo
  const [selectAllChecked, setSelectAllChecked] = React.useState(false)
  const [selectedDependencies, setSelectedDependencies] = useState<{
    [key: string]: 'stable' | 'latest'
  }>({})
  const outdatedCount = 46
  const nbSelectedDependencies = Object.keys(selectedDependencies).length
  const hasSelectedDependencies = Object.keys(selectedDependencies).length > 0
  const [score, setScore] = React.useState(0)

  React.useEffect(() => {
    setScore(repository.score)
  }, [repository.score])

  React.useEffect(() => {
    const newScore = getNewScore(
      nbSelectedDependencies,
      outdatedCount,
      repository.packageJson,
    )
    setScore(newScore)
  }, [nbSelectedDependencies, repository])

  const items = Object.keys(selectedDependencies).map(
    (key) =>
      `${key}${
        selectedDependencies[key] === 'latest'
          ? `@${selectedDependencies[key]}`
          : ''
      }`,
  )

  const location = useLocation()
  const commandeLine = `yarn upgrade ${items.join(' ')}`
  const { onCopy, hasCopied } = useClipboard(commandeLine)

  const { dependencies, devDependencies } = useMemo(() => {
    let dependencies: Dependency[] = []
    let devDependencies: Dependency[] = []

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
    return { dependencies, devDependencies }
  }, [repository])

  const onDependencySelected = React.useCallback(
    (checked: boolean, name: string, type: 'stable' | 'latest') => {
      if (checked) {
        setSelectedDependencies((prevSelectedDependencies) => ({
          ...prevSelectedDependencies,
          [name]: type,
        }))
      } else {
        setSelectedDependencies((prevSelectedDependencies) => {
          const { [name]: omit, ...rest } = prevSelectedDependencies
          return { ...rest }
        })
      }
    },
    [setSelectedDependencies],
  )

  const TabListItems = ({
    dependencies,
    devDependencies,
  }: {
    dependencies: Dependency[]
    devDependencies: Dependency[]
  }) => {
    return (
      <TabList>
        <Tab disabled={dependencies.length === 0}>Dependencies</Tab>
        <Tab disabled={devDependencies.length === 0}>Dev Dependencies </Tab>
      </TabList>
    )
  }
  const DependenciesTypeTabs = React.memo(TabListItems)

  const onSelectAllDependencies = React.useCallback(() => {
    if (selectAllChecked) {
      setSelectedDependencies({})
    } else {
      const deps = dependencies
        .map((dep) => {
          return { [dep.name]: 'latest' }
        })
        .concat(
          devDependencies.map((dep) => {
            return { [dep.name]: 'latest' }
          }),
        )
      let selectedDeps = {}
      for (const dep of deps) {
        selectedDeps = { ...selectedDeps, ...dep }
      }
      setSelectedDependencies(selectedDeps)
    }
    setSelectAllChecked((selectAllChecked) => !selectAllChecked)
  }, [setSelectedDependencies, dependencies, devDependencies, selectAllChecked])

  if (!repository) {
    return null
  }

  return (
    <>
      <Box bg="#24294e" px={3}>
        <Box maxWidth="60rem" marginX="auto">
          <Header>
            <Button
              onClick={() => {
                window.location.href = `https://github.com/premieroctet/reactivated-app/`
              }}
              variant="link"
              variantColor="brand"
              rounded={8}
              mr={5}
            >
              GitHub Project
            </Button>
            <Button
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_API_HOST}/auth/github`
              }}
              variantColor="brand"
              rightIcon={FaGithub}
              rounded={8}
            >
              Login
            </Button>
          </Header>
        </Box>
      </Box>

      <Box
        backgroundColor="#24294e"
        height="7rem"
        position="absolute"
        left={0}
        right={0}
      />

      <Box
        mb={10}
        p={[3, 3, 3, 0]}
        maxWidth="60rem"
        marginX="auto"
        position="relative"
      >
        <AppHeaderDemo repository={repository} score={score} />

        {/* bug bizarre */}
        {/* <Stack isInline>
        <Tab isActive>
          <>
            Outdated Dependencies{' '}
            <Badge fontSize="xs" variantColor="red">
              {outdatedCount}
            </Badge>
          </>
        </Tab>
        <Tab>
          <>
            Pull Requests
            <Badge
              animate
              zIndex={30}
              pos={'relative'}
              fontSize={'xs'}
              variantColor="brand"
              top={0}
            >
              0
            </Badge>
          </>
        </Tab>
      </Stack> */}

        <Container
          roundedTopLeft={location.pathname.includes('pull-requests') ? 10 : 0}
          pb={4}
        >
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

          <SelectAll
            selectAllChecked={selectAllChecked}
            onSelectAllDependencies={onSelectAllDependencies}
          />
          <DependenciesProvider>
            {repository &&
              repository.dependencies &&
              repository.dependencies.deps && (
                <Box w={['100%', 'unset']} minW={['100%']} mt={4}>
                  <Tabs
                    defaultIndex={dependencies.length === 0 ? 1 : 0}
                    isFitted
                    variantColor="secondary"
                    variant="line"
                  >
                    <DependenciesTypeTabs
                      dependencies={dependencies}
                      devDependencies={devDependencies}
                    />

                    <TabPanels>
                      <TabPanel>
                        <DependenciesList
                          dependencies={dependencies}
                          selectedDependencies={selectedDependencies}
                          onDependencySelected={onDependencySelected}
                        />
                      </TabPanel>
                      <TabPanel>
                        <DependenciesList
                          onDependencySelected={onDependencySelected}
                          dependencies={devDependencies}
                          selectedDependencies={selectedDependencies}
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
                    <Tooltip
                      hasArrow
                      aria-label="Disabled in demo"
                      label="Disabled in demo"
                      placement="left"
                      shouldWrapChildren
                    >
                      <Button
                        leftIcon={DiGitPullRequest}
                        variantColor="gray"
                        isDisabled={true}
                        m={2}
                      >
                        Create my Pull Request
                      </Button>
                    </Tooltip>
                  </Flex>
                </Box>
              )}
          </DependenciesProvider>
        </Container>
      </Box>
    </>
  )
}

export default Demo
