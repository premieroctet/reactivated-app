import React from 'react'
import { BoxProps, Box } from '@chakra-ui/core'
import DependencyItem from './DependencyItem'

interface Props {
  dependencies: Dependency[]
}

const TableHeader = (props: BoxProps) => (
  <Box as="td" fontSize="md" textAlign="center" {...props} />
)

const DependenciesList = ({ dependencies }: Props) => {
  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      <Box as="table" w="100%" mt={6}>
        <thead>
          <Box
            as="tr"
            color="teal.400"
            borderBottom="1px"
            borderBottomColor="teal"
          >
            <TableHeader>Dependency</TableHeader>
            <TableHeader>Required</TableHeader>
            <TableHeader>Stable</TableHeader>
            <TableHeader>Latest</TableHeader>
            <TableHeader>Status</TableHeader>
          </Box>
        </thead>
        <tbody>
          {dependencies.map((key, index) => (
            <Box
              as="tr"
              h={10}
              key={key[0]}
              borderBottom={index < dependencies.length - 1 ? '1px' : undefined}
              borderBottomColor="black"
            >
              <DependencyItem dependency={key} />
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}

export default DependenciesList
