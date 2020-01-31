import { useToastOptions, useToast } from '@chakra-ui/core'
import { useCallback } from 'react'

const defaultConfig: useToastOptions = {
  duration: 5000,
  isClosable: true,
  position: 'top',
}

const useChakraToast = () => {
  const showToast = useToast()

  return useCallback(
    (options: useToastOptions) => {
      showToast({
        ...defaultConfig,
        ...options,
      })
    },
    [showToast],
  )
}

export default useChakraToast
