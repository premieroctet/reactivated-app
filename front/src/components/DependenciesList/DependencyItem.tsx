import React from 'react'
import semver from 'semver'
import {
  Box,
  Link,
  Switch,
  Stack,
  Tag,
  Flex,
  FormLabel,
  Text,
} from '@chakra-ui/core'
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
  const hasMinorUpdate = semver.satisfies(dependency.current, dependency.latest)
  const hasStableUpdate =
    dependency.current !== dependency.wanted &&
    dependency.wanted !== dependency.latest

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
            href={`https://www.npmjs.com/package/${dependency.name}`}
          >
            {dependency.prefix ? (
              <>
                <Text color="secondary.50" as="span">
                  {dependency.prefix}
                </Text>
                {dependency.name.split(dependency.prefix)[1]}
              </>
            ) : (
              <> {dependency.name}</>
            )}
          </Link>
        </Stack>

        <Tag isTruncated variantColor="gray" size="sm">
          {dependency.current}
        </Tag>
      </Flex>

      {hasStableUpdate && (
        <Box px={4} bg="white" zIndex={1}>
          <FormLabel
            cursor="pointer"
            htmlFor={`${dependency.name}-${dependency.wanted}`}
          >
            <Tag variantColor="green" size="sm">
              {dependency.wanted}
            </Tag>
          </FormLabel>
          <Switch
            isChecked={isStableChecked}
            id={`${dependency.name}-${dependency.wanted}`}
            size="sm"
            onChange={(e) => {
              onSelect(e.currentTarget.checked, dependency.name, 'stable')
            }}
            color="secondary"
          />
        </Box>
      )}

      <Box px={4} bg="white" zIndex={1}>
        <FormLabel
          cursor="pointer"
          htmlFor={`${dependency.name}-${dependency.latest}`}
        >
          <Tag variantColor="orange" size="sm">
            {dependency.latest}
          </Tag>
        </FormLabel>
        <Switch
          isChecked={isLatestChecked}
          id={`${dependency.name}-${dependency.latest}`}
          size="sm"
          onChange={(e) => {
            onSelect(e.currentTarget.checked, dependency.name, 'latest')
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
