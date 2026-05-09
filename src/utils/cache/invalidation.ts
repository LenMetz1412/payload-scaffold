interface CacheInvalidationEntry {
  timestamp: number
  documentId: string
  collection: string
}

class CacheInvalidationManager {
  private invalidations = new Map<string, CacheInvalidationEntry>()
  private readonly TTL = 5 * 60 * 1000

  invalidateDocument(collection: string, documentId: string): void {
    const key = `${collection}:${documentId}`
    this.invalidations.set(key, {
      timestamp: Date.now(),
      documentId,
      collection,
    })
    this.cleanup()
  }

  shouldBustCache(collection: string, documentId: string): boolean {
    const key = `${collection}:${documentId}`
    const entry = this.invalidations.get(key)
    if (!entry) return false
    const isValid = Date.now() - entry.timestamp < this.TTL
    if (!isValid) this.invalidations.delete(key)
    return isValid
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.invalidations.entries()) {
      if (now - entry.timestamp > this.TTL) this.invalidations.delete(key)
    }
  }

  clear(): void {
    this.invalidations.clear()
  }
}

export const cacheInvalidationManager = new CacheInvalidationManager()

export const invalidateDocumentCache = (collection: string, documentId: string) => {
  cacheInvalidationManager.invalidateDocument(collection, documentId)
}

export const shouldBustDocumentCache = (collection: string, documentId: string): boolean => {
  return cacheInvalidationManager.shouldBustCache(collection, documentId)
}
