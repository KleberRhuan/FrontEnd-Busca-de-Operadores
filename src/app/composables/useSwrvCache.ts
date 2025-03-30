import useSWRV from 'swrv'
import type { AxiosResponse } from 'axios'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import type { IConfig } from 'swrv'
import api from '@/lib/axios'
import type { Ref } from 'vue'

export function useSwrvCache<T>(url: string, params: Ref<Record<string, unknown>>) {
  const cacheKey = generateCacheKey(url, params.value)
  const localStorageCache: LocalStorageCache = new LocalStorageCache(cacheKey, 5 * 60 * 1000)
  const defaultOptions: Partial<IConfig> = {
    dedupingInterval: 10000,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
    revalidateOnFocus: false,
    cache: localStorageCache,
  }

  const fetcher = async (): Promise<AxiosResponse<T>> => {
    return await api.get<T>(url, { params: params.value })
  }

  const { data, error, isValidating, mutate } = useSWRV<AxiosResponse<T>>(url, fetcher, {
    ...defaultOptions,
  })

  const refresh = async () => await mutate(() => fetcher())
  const invalidate = async () => {
    localStorageCache.delete(cacheKey)
    return await mutate()
  }

  return {
    data,
    error,
    isLoading: isValidating,
    refresh,
    invalidate,
    mutate,
  }
}

function generateCacheKey(url: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc, key) => {
        acc[key] = params[key]
        return acc
      },
      {} as Record<string, unknown>,
    )

  return `${url}?${JSON.stringify(sortedParams)}`
}
