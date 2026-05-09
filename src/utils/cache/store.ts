/* eslint-disable @typescript-eslint/no-explicit-any */

/////////////// VIP readme!! /////////////
/// manual cache because unstable_cache does not allow more than 2mb
/// currently used only for filters docs if we need to store more data switch to redis or so
////////////////////////////////

type CacheEntry<T> = {
  data: T
  timestamp: number
  tags: string[]
}

type PendingClear = {
  type: 'tag' | 'key' | 'all'
  value?: string
  timer: NodeJS.Timeout
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private ttl: number
  private lastClearTimestamp: number = 0
  private clearCooldown: number = 30 * 1000
  private pendingClears = new Map<string, PendingClear>()

  constructor(ttlMinutes: number = 30) {
    this.ttl = ttlMinutes * 60 * 1000
  }

  // dedounce clear in case of ev concurrent cms editing
  private executeClear(type: 'tag' | 'key' | 'all', value?: string): void {
    const now = Date.now()
    const timeSinceLastClear = now - this.lastClearTimestamp

    if (this.lastClearTimestamp > 0 && timeSinceLastClear < this.clearCooldown) {
      const remainingMs = this.clearCooldown - timeSinceLastClear
      const clearId = type === 'all' ? 'all' : `${type}:${value}`

      const existing = this.pendingClears.get(clearId)
      if (existing) {
        clearTimeout(existing.timer)
        console.log(`⏳ Rescheduling cache clear for ${clearId}`)
      } else {
        console.log(`⏳ Scheduling cache clear for ${clearId} in ${Math.ceil(remainingMs / 1000)}s`)
      }

      const timer = setTimeout(() => {
        this.pendingClears.delete(clearId)
        this.performClear(type, value)
      }, remainingMs)

      this.pendingClears.set(clearId, { type, value, timer })
      return
    }

    this.performClear(type, value)
  }

  private performClear(type: 'tag' | 'key' | 'all', value?: string): void {
    let count = 0

    if (type === 'tag' && value) {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.tags.includes(value)) {
          this.cache.delete(key)
          count++
        }
      }
      console.log(`🗑️  Cleared ${count} cache entries with tag: ${value}`)
    } else if (type === 'key' && value) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(value)) {
          this.cache.delete(key)
          count++
        }
      }
      console.log(`🗑️  Cleared ${count} cache entries with key prefix: ${value}`)
    } else if (type === 'all') {
      count = this.cache.size
      this.cache.clear()
      console.log(`🗑️  Cleared entire cache (${count} entries)`)
    }

    this.lastClearTimestamp = Date.now()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    if (age > this.ttl) {
      const env = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
      console.log(`⏰ ${env} Cache expired for key: ${key} (age: ${Math.round(age / 1000)}s)`)
      this.cache.delete(key)
      if (process.env.NODE_ENV === 'development') {
        console.log(this.getStats())
      }
      return null
    }

    const ageMinutes = Math.round(age / 60000)
    const env = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
    console.log(`✅ ${env} CACHE HIT: ${key} (age: ${ageMinutes}min)`)
    return entry.data as T
  }

  set<T>(key: string, data: T, tags: string[] = []): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      tags,
    })
    const env = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
    const sizeMB = (JSON.stringify(data).length / 1024 / 1024).toFixed(2)
    console.log(`💾 ${env} CACHED: ${key} (${sizeMB} MB) [tags: ${tags.join(', ')}]`)
  }

  clearByTag(tag: string): void {
    this.executeClear('tag', tag)
  }

  clearByKey(keyPrefix: string): void {
    this.executeClear('key', keyPrefix)
  }

  clearAll(): void {
    this.executeClear('all')
  }

  getStats() {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Math.round((Date.now() - entry.timestamp) / 1000),
      sizeMB: (JSON.stringify(entry.data).length / 1024 / 1024).toFixed(2),
      data: entry.data,
      tags: entry.tags,
    }))
    return {
      size: this.cache.size,
      entries,
      pendingClears: Array.from(this.pendingClears.keys()),
    }
  }
}

//  persistency !!
const CACHE_KEY = Symbol.for('__APP_CACHE__')
if (!(globalThis as any)[CACHE_KEY]) {
  ;(globalThis as any)[CACHE_KEY] = new CacheManager(
    process.env.NODE_ENV === 'development' ? 10 : 30,
  )
}

export const cacheStore = (globalThis as any)[CACHE_KEY] as CacheManager
