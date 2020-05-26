import React, { memo } from 'react'
import { IconButton, Image, Text, Box, Flex } from '@chakra-ui/core'
import { Column, Row } from '@components/Flex'
import FrameworkTag from '../FrameworkTag/FrameworkTag'
import HealthBar from '@components/HealthBar/HealthBar'

interface IProps {
  repository: Repository
}

const RepositoryListItem = memo(({ repository }: IProps) => {
  return (
    <Flex
      position="relative"
      cursor="pointer"
      rounded={10}
      shadow="lg"
      bg="white"
      mb={8}
      px={5}
      py={8}
      overflow="hidden"
    >
      <Box
        bg="brand.50"
        position="absolute"
        bottom={0}
        height={1}
        left={0}
        right={0}
        zIndex={0}
      >
        <Box
          bg="brand.500"
          position="absolute"
          bottom={0}
          height={1}
          left={0}
          transition="width 300ms"
          width={`${repository.score}%`}
          zIndex={0}
        />
        <Box
          shadow="lg"
          position="absolute"
          bottom={0}
          height={1}
          width={2}
          bg="brand.500"
          boxShadow="2px 1px 6px 3px rgba(71,253,167,0.6)"
          left={`${repository.score}%`}
          zIndex={20}
        />
      </Box>
      <Flex flexDirection="column" width="100%">
        <Flex
          zIndex={10}
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Row justifyContent="center">
            <Image
              shadow="md"
              size={16}
              borderRadius={40}
              src={repository.repoImg}
              alt={repository.name}
            />
            <Column alignItems="flex-start" ml={5}>
              <Text as="span" fontSize="2xl" fontWeight="semibold">
                {repository.name}
              </Text>
              {repository.framework !== null && (
                <FrameworkTag framework={repository.framework} />
              )}
            </Column>
          </Row>

          <Row alignItems="center">
            {repository.score && <HealthBar score={repository.score} />}

            <IconButton
              variant="ghost"
              fontSize="3xl"
              aria-label="View"
              icon="chevron-right"
            />
          </Row>
        </Flex>
      </Flex>
    </Flex>
  )
})

export default RepositoryListItem
