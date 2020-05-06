import React from 'react'
import semver from 'semver'
import { Box, Link, Switch, Stack, Tag, Flex, FormLabel } from '@chakra-ui/core'
import { Tooltip } from '@chakra-ui/core'

interface IProps {
  dependency: Dependency
  onSelect: (checked: boolean, name: string, type: 'stable' | 'latest') => void
  isStableChecked?: boolean
  isLatestChecked?: boolean
}

const DependencyItem: React.FC<IProps> = ({
  dependency,
  onSelect,
  isLatestChecked = false,
  isStableChecked = false,
}) => {
  const hasMinorUpdate = semver.satisfies(dependency[1], dependency[3])
  const hasStableUpdate =
    dependency[1] !== dependency[2] && dependency[2] !== dependency[3]

  return (
    <Stack
      p={2}
      justifyContent="space-between"
      alignItems="center"
      position="relative"
      isInline
    >
      <Flex
        zIndex={1}
        bg="white"
        justifyContent="space-between"
        direction="row"
        width="20rem"
        p={2}
        rounded={10}
        shadow="sm"
      >
        <Stack alignItems="center" isInline>
          <Box>
            <Tooltip
              zIndex={1}
              hasArrow
              aria-label={hasMinorUpdate ? 'Minor' : 'Major'}
              label={hasMinorUpdate ? 'Minor update' : 'Major update'}
              placement="top"
            >
              <Box
                bg={hasMinorUpdate ? 'yellow.300' : 'red.200'}
                size={4}
                rounded={20}
              />
            </Tooltip>
          </Box>
          <Link
            isTruncated
            maxWidth="14rem"
            mr={2}
            fontWeight="semibold"
            isExternal
            href={`https://www.npmjs.com/package/${dependency[0]}`}
          >
            {dependency[0]}
          </Link>
        </Stack>

        <Tag variantColor="gray" size="sm">
          {dependency[1]}
        </Tag>
      </Flex>

      {hasStableUpdate && (
        <Box px={4} bg="white" zIndex={1}>
          <FormLabel
            cursor="pointer"
            htmlFor={`${dependency[0]}-${dependency[2]}`}
          >
            <Tag variantColor="green" size="sm">
              {dependency[2]}
            </Tag>
          </FormLabel>
          <Switch
            isChecked={isStableChecked}
            id={`${dependency[0]}-${dependency[2]}`}
            size="sm"
            onChange={(e) => {
              onSelect(e.currentTarget.checked, dependency[0], 'stable')
            }}
            color="secondary"
          />
        </Box>
      )}

      <Box px={4} bg="white" zIndex={1}>
        <FormLabel
          cursor="pointer"
          htmlFor={`${dependency[0]}-${dependency[3]}`}
        >
          <Tag variantColor="orange" size="sm">
            {dependency[3]}
          </Tag>
        </FormLabel>
        <Switch
          isChecked={isLatestChecked}
          id={`${dependency[0]}-${dependency[3]}`}
          size="sm"
          onChange={(e) => {
            onSelect(e.currentTarget.checked, dependency[0], 'latest')
          }}
          color="secondary"
        />
      </Box>

      <Box
        zIndex={0}
        position="absolute"
        left={10}
        right={10}
        border="1px dashed"
        borderColor="gray.200"
      ></Box>
    </Stack>
  )
}

export default DependencyItem
