import type { HeroField, Media } from '@/payload-types'

export const sanitizeString = (value?: string | null): string | undefined =>
  value?.trim().length ? value.trim() : undefined

export const sanitizeNumber = (value?: number | string | null): number | undefined => {
  if (value == null) return undefined

  const num = typeof value === 'string' ? Number(value) : value

  return typeof num === 'number' && !Number.isNaN(num) ? num : undefined
}

export const normalizeStringForComparison = (value?: string | null): string | undefined =>
  value?.trim().length ? value.trim().toLocaleLowerCase() : undefined

// PAYLOAD wacky relations validation

export const isRelationPopulated = <T extends object>(item: unknown): item is T => {
  return !!item && typeof item === 'object'
}

export const filterPopulatedRelations = <T extends object>(
  items?: (string | T)[] | null,
): T[] | undefined => {
  return items?.filter(isRelationPopulated) as T[] | undefined
}

export const getPopulatedRelation = <T extends object>(
  item?: string | T | null | number,
): T | undefined => {
  return isRelationPopulated(item) ? item : undefined
}

export const getRelationId = <T extends { id: string }>(
  item?: string | T | null | number,
): string | undefined => {
  if (!item) return undefined
  if (typeof item === 'string') return item
  if (typeof item === 'number') return item.toString()
  return item.id
}

export const getRelationIds = <T extends { id: string }>(
  items?: (string | T)[] | null,
): string[] | undefined => {
  if (!items || items.length === 0) return undefined
  return items.map((item) => getRelationId(item)).filter((id): id is string => !!id)
}

export function sanitizeFormInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // tags
    .replace(/[<>{}[\]\\]/g, '') // code
    .replace(/[\x00-\x1F\x7F]/g, '') // control
    .slice(0, 120)
}

export const sanitizeMetaImage = (originalMedia: Media | string | null | undefined) => {
  const media = getPopulatedRelation(originalMedia)
  if (!media) return null
  if (!media.mimeType?.startsWith('image/')) return null
  return media
}

export const hasValidHeroImageType = (type: string | undefined): boolean => {
  return !!type && ['highImpact', 'mediumImpact'].includes(type)
}

export const sanitizeHeroMetaImage = (hero: HeroField | null | undefined) => {
  return hasValidHeroImageType(hero?.type) ? sanitizeMetaImage(hero?.slide?.[0]?.media) : null
}

