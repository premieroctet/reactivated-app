// @ts-nocheck
import React from 'react'
import { Box, Image } from '@chakra-ui/core'

const Screenshot = () => {
  return (
    <Box m={3} position="relative" width="100%">
      <Box
        width="100%"
        maxHeight="100%"
        maxWidth="100%"
        shadow="lg"
        as="svg"
        viewBox="0 0 940 623"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fill-rule="evenodd">
          <rect fill="#FFF" width="940" height="623" rx="9"></rect>
          <path
            d="M0 36h940V9a9 9 0 0 0-9-9H9a9 9 0 0 0-9 9v27z"
            fill="#e8e8e8"
          ></path>
          <circle fill="#FD6157" cx="18" cy="18" r="6"></circle>
          <circle fill="#FDBD04" cx="38" cy="18" r="6"></circle>
          <circle fill="#30CA2E" cx="58" cy="18" r="6"></circle>
        </g>
      </Box>
      <Box top="5%" position="absolute">
        <Image alt="Reactivated.app UI" width="100%" src="/p4.png" />
      </Box>
    </Box>
  )
}

export default Screenshot
