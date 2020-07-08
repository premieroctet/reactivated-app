import React, { useState } from 'react'
import { Button, Text, Image, Flex } from '@chakra-ui/core'
import { FaPlug } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionImage = motion.custom(Image)

const FirstAppButton = () => {
  const [isHover, setHovered] = useState(false)

  return (
    <>
      <Flex
        mt={10}
        pt={8}
        flexDirection="column"
        alignItems="center"
        pos="relative"
      >
        <MotionImage
          left={0}
          right={0}
          marginX="auto"
          position="absolute"
          top={isHover ? 190 : 0}
          animate
          src="/ram.svg"
          width={isHover ? 100 : 130}
        />

        <Text
          mt={10}
          mb={2}
          color="gray.800"
          fontSize="xl"
          fontWeight="semibold"
        >
          No Reactivated app?
        </Text>
        <Text mb={5} textAlign="center" maxWidth="20rem" color="gray.400">
          You have no reactivated app yet! Start now by adding your first app
          from a GitHub repository
        </Text>

        <Link to="/add-repository">
          <Button
            onMouseEnter={() => {
              setHovered(true)
            }}
            onMouseLeave={() => {
              setHovered(false)
            }}
            rightIcon={FaPlug}
            cursor="pointer"
            variantColor={isHover ? 'secondary' : 'secondary'}
            variant="solid"
            size={isHover ? 'lg' : 'md'}
            shadow={isHover ? 'lg' : 'none'}
          >
            Reactivate your first app
          </Button>
        </Link>
      </Flex>
    </>
  )
}

export default FirstAppButton
