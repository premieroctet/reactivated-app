import React, { useState } from 'react'
import { BoxProps, Box, Code, Button } from '@chakra-ui/core'
import DependencyItem from './DependencyItem'
import { useClipboard } from '@chakra-ui/core'

interface IProps {
  dependencies: Dependency[]
  isDev?: boolean
}

const TableHeader = (props: BoxProps) => (
  <Box as="td" fontSize="md" textAlign="center" {...props} />
)

const DependenciesList: React.FC<IProps> = ({ dependencies, isDev }) => {
  const [packages, setPackages] = useState<string[]>([])

  const commandeLine = `yarn upgrade ${isDev ? `--dev` : ``} ${packages.join(
    ' ',
  )}`

  const { onCopy, hasCopied } = useClipboard(commandeLine)

  return (
    <Box overflowX="auto" whiteSpace="nowrap">
      {packages.length > 0 && (
        <Code
          position="relative"
          width="100%"
          rounded={10}
          whiteSpace="normal"
          my={10}
          p={5}
        >
          {commandeLine}
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
        </Code>
      )}

      <Box as="table" w="100%" mt={6}>
        <thead>
          <Box as="tr" color="teal.400" my={4}>
            <TableHeader></TableHeader>
            <TableHeader></TableHeader>
            <TableHeader>Current</TableHeader>
            <TableHeader>Stable</TableHeader>
            <TableHeader>Latest</TableHeader>
          </Box>
        </thead>
        <tbody>
          {dependencies.map((key, index) => (
            <Box
              as="tr"
              h={10}
              key={key[0]}
              borderBottom={index < dependencies.length - 1 ? '1px' : undefined}
              borderBottomColor="gray.300"
            >
              <DependencyItem
                onSelect={(checked: boolean, name: string) => {
                  if (checked) {
                    setPackages([...packages, name])
                  } else {
                    setPackages([...packages.filter((value) => value !== name)])
                  }
                }}
                dependency={key}
              />
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}

export default DependenciesList
