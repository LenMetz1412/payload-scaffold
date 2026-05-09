/* eslint-disable @typescript-eslint/no-explicit-any */
import { cacheStore } from './store'

type CacheConfig = {
  key: string
  tags?: string[]
}

export const createCacheKey = (baseKey: string, args: any[]): string => {
  if (args.length === 0) return baseKey

  const argsStr = args
    .map((arg) => {
      if (typeof arg === 'string') return arg
      if (typeof arg === 'number') return String(arg)
      if (typeof arg === 'boolean') return String(arg)
      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([_, v]) => v !== undefined && v !== null)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      }
      return JSON.stringify(arg)
    })
    .join('-')

  return `${baseKey}-${argsStr}`
}

export function createCachedFunction<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  config: CacheConfig,
) {
  const { key, tags = [] } = config

  return async (...args: TArgs): Promise<TReturn> => {
    const cacheKey = createCacheKey(key, args)

    const cached = cacheStore.get<TReturn>(cacheKey)
    if (cached !== null) {
      return cached
    }

    const env = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
    console.log(`🔥 ${env} CACHE MISS: ${key}`, args.length > 0 ? args : '')
    const startTime = Date.now()
    const result = await fn(...args)
    const duration = Date.now() - startTime

    cacheStore.set(cacheKey, result, tags)
    console.log(`⏱️  Query took ${duration}ms`)

    return result
  }
}

export const clearCacheByTag = (tag: string) => cacheStore.clearByTag(tag)
export const clearCacheByKey = (keyPrefix: string) => cacheStore.clearByKey(keyPrefix)
export const clearAllCache = () => cacheStore.clearAll()

export const getCacheStats = () => cacheStore.getStats()
