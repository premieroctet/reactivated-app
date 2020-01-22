import React, { memo } from 'react'
import semver from 'semver'
import { Box, BoxProps } from '@chakra-ui/core'

interface Props {
  dependency: Dependency
}

const TableCell = (props: BoxProps) => (
  <Box as="td" textAlign="center" fontSize={['sm', 'sm', 'md']} {...props} />
)

const DependencyItem = memo(({ dependency }: Props) => {
  const loadStatus = () => {
    if (semver.satisfies(dependency[2], dependency[3])) {
      return 'green.400'
    } else {
      return 'orange.400'
    }
  }

  return (
    <>
      <TableCell minW={20}>{dependency[0]}</TableCell>
      <TableCell minW={20}>{dependency[1]}</TableCell>
      <TableCell minW={20}>{dependency[2]}</TableCell>
      <TableCell minW={20}>{dependency[3]}</TableCell>
      <TableCell>
        <Box
          bg={loadStatus()}
          size={6}
          rounded={3}
          border="2px solid teal"
          m="0 auto"
        />
      </TableCell>
    </>
  )
})

export default DependencyItem
