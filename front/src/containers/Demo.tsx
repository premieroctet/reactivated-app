import {
  Box,
  Button,
  Code,
  Flex,
  Tooltip,
  useClipboard,
  Stack,
  Badge,
  DarkMode,
} from '@chakra-ui/core'
import { DependenciesProvider } from '@contexts/DependenciesContext'
import { getNewScore, sortDependencies } from '@utils/dependencies'
import React, { useMemo, useState } from 'react'
import { DiGitPullRequest } from 'react-icons/di'
import { useLocation } from 'react-router'
import Container from '../components/Container'
import AppHeaderDemo from '../components/Demo/AppHeaderDemo'
import { reactRepo } from '../components/Demo/model'
import Header from '../components/Header'
import { SelectAll } from './Repository/ViewRepo'
import { Tab } from '@components/AppBar'
import { Global } from '@emotion/core'
import HeaderLinks from '@components/Header/HeaderLinks'
import DependencyTabs from '@components/DependencyTabs'

function Demo() {
  const repository = reactRepo
  const [selectAllChecked, setSelectAllChecked] = React.useState(false)
  const [selectedDependencies, setSelectedDependencies] = useState<{
    [key: string]: 'stable' | 'latest'
  }>({})

  const outdatedCount = repository.dependencies!.deps.length
  const nbSelectedDependencies = Object.keys(selectedDependencies).length
  const hasSelectedDependencies = Object.keys(selectedDependencies).length > 0
  const [score, setScore] = React.useState(repository.score)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  React.useEffect(() => {
    const newScore = getNewScore(
      nbSelectedDependencies,
      outdatedCount,
      repository.packageJson,
    )
    setScore(newScore)
  }, [nbSelectedDependencies, repository, outdatedCount])

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

  const { dependencies, devDependencies } = useMemo(
    () => sortDependencies(repository!),
    [repository],
  )

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
      <Global
        styles={{
          body: {
            backgroundColor: '#f5f9f9',
          },
        }}
      />
      <DarkMode>
        <Box bg="#24294e" px={3}>
          <Box maxWidth="60rem" marginX="auto">
            <Header>
              <HeaderLinks loading={false} />
            </Header>
          </Box>
        </Box>
      </DarkMode>

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

        <Stack isInline>
          <Tab isActive>
            <>
              Outdated Dependencies{' '}
              <Badge fontSize="xs" variantColor="red">
                {outdatedCount}
              </Badge>
            </>
          </Tab>

          <Tooltip
            hasArrow
            aria-label="Disable in demo"
            label="Disable in demo"
            placement="bottom"
            shouldWrapChildren
          >
            <Tab>
              <>
                Pull Requests
                <Badge zIndex={30} fontSize="xs" variantColor="brand" top={0}>
                  0
                </Badge>
              </>
            </Tab>
          </Tooltip>
        </Stack>

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
            <Box w={['100%', 'unset']} minW={['100%']} mt={4}>
              <DependencyTabs
                dependencies={dependencies}
                devDependencies={devDependencies}
                selectedDependencies={selectedDependencies}
                onDependencySelected={onDependencySelected}
              />

              <Flex
                zIndex={10}
                pos={hasSelectedDependencies ? 'sticky' : 'inherit'}
                bottom={0}
                flexDir="row-reverse"
              >
                <Tooltip
                  hasArrow
                  aria-label="Disable in demo"
                  label="Disable in demo"
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
          </DependenciesProvider>
        </Container>
      </Box>
    </>
  )
}

export default Demo
