import { useEffect } from 'react'

const useMessageListener = (listener: (e: MessageEvent) => void) => {
  useEffect(() => {
    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [listener])
}

export default useMessageListener
