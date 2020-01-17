import React from 'react'
import { Flex, FlexProps } from '@chakra-ui/core'

interface Props extends FlexProps {}

export const Row = (props: Props) => <Flex direction="row" {...props} />

export const Column = (props: Props) => <Flex direction="column" {...props} />
