import useSWR, { ConfigInterface, keyInterface } from 'swr'
import { AxiosResponse } from 'axios'

const useRequest = <T extends any>(
  key: keyInterface,
  config: ConfigInterface,
) => {
  return useSWR<T>(key, config)
}

const useAxiosRequest = <T extends any>(
  key: keyInterface,
  config: ConfigInterface,
) => {
  const { data: response, ...rest } = useRequest<AxiosResponse<T>>(key, config)
  const data = response?.data

  return { data, ...rest }
}

export { useRequest, useAxiosRequest }
