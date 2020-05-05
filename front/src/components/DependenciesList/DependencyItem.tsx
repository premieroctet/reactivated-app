import React from 'react'
import semver from 'semver'
import { Box, BoxProps, Link, Switch } from '@chakra-ui/core'
import { Tooltip } from '@chakra-ui/core'

interface IProps {
  dependency: Dependency
  onSelect: (checked: boolean, name: string) => void
}

const TableCell = (props: BoxProps) => (
  <Box
    py={4}
    as="td"
    textAlign="center"
    fontSize={['sm', 'sm', 'md']}
    {...props}
  />
)

const DependencyItem: React.FC<IProps> = ({ dependency, onSelect }) => {
  const hasMajorUpdate = semver.satisfies(dependency[2], dependency[3])

  return (
    <>
      <TableCell>
        <Tooltip
          hasArrow
          aria-label={hasMajorUpdate ? 'Major' : 'Minor'}
          label={hasMajorUpdate ? 'Major update' : 'Minor update'}
          placement="top"
        >
          <Box
            bg={hasMajorUpdate ? 'red.300' : 'yellow.300'}
            size={6}
            rounded={20}
            m="0 auto"
          />
        </Tooltip>
      </TableCell>
      <TableCell textAlign="left" minW={20}>
        <Link
          fontWeight="semibold"
          isExternal
          href={`https://www.npmjs.com/package/${dependency[0]}`}
        >
          {dependency[0]}
        </Link>
      </TableCell>
      <TableCell minW={20}>{dependency[1]}</TableCell>
      <TableCell minW={20}>{dependency[2]}</TableCell>
      <TableCell minW={20}>{dependency[3]} </TableCell>
      <TableCell minW={20}>
        <Switch
          onChange={(e) => {
            onSelect(e.currentTarget.checked, dependency[0])
          }}
          color="secondary"
        />
      </TableCell>
    </>
  )
}

export default DependencyItem
