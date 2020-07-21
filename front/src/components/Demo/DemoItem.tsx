import { Flex, IconButton, Image, Text } from '@chakra-ui/core'
import React from 'react'
import { Column, Row } from '../Flex'
import FrameworkTag from '../FrameworkTag/FrameworkTag'
import LoadBar from '../LoadBar'
import LoadScore from '../LoadScore'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { reactRepo } from './model'

const DemoItem = React.forwardRef((props, ref) => {
  const repository = reactRepo

  return (
    <Link key={repository.id} to={`/demo`}>
      <Flex
        ref={ref}
        position="relative"
        cursor="pointer"
        rounded={10}
        shadow="md"
        bg="white"
        mb={4}
        px={5}
        py={8}
        overflow="hidden"
      >
        {repository.score > 0 && <LoadBar score={repository.score} />}
        <Flex flexDirection="column" width="100%">
          <Flex
            zIndex={10}
            width="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Row justifyContent="center">
              <Image
                size={16}
                borderRadius={40}
                src={repository.repoImg}
                alt={repository.name}
              />
              <Column alignItems="flex-start" ml={5}>
                <Text as="span" fontSize="2xl" fontWeight="semibold">
                  {repository.name}
                </Text>
                <FrameworkTag framework="react" />
              </Column>
            </Row>

            <Row alignItems="center">
              <LoadScore score={repository.score} />
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
    </Link>
  )
})

const DemoItemMotion = motion.custom(DemoItem)

export default DemoItemMotion
