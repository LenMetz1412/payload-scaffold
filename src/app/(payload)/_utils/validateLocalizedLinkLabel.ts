import type { TextFieldSingleValidation, UploadFieldSingleValidation } from 'payload'
import { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'

const LOCALES = new Set<Locale>(locales)
const ALL_LOCALES = [...LOCALES]
const COLLECTIONS = new Set<CollectionSlugs>(Object.values(CollectionSlugs) as CollectionSlugs[])
const localeLabels: Record<Locale, string> = { de: 'Deutsch', en: 'English' }

type TextValidateValue = Parameters<TextFieldSingleValidation>[0]
type UploadValidateValue = Parameters<UploadFieldSingleValidation>[0]
type ValidateValue = TextValidateValue | UploadValidateValue
type ValidateOptions = Parameters<TextFieldSingleValidation>[1]
type UnknownRecord = Record<string, unknown>
type OptionsWithOriginalDoc = ValidateOptions & { originalDoc?: UnknownRecord }
type LocalizedFieldValue = string | number
type GenericLocalizedValidation = (
  value: ValidateValue,
  options: ValidateOptions,
) => Promise<string | true> | string | true

const hasOriginalDoc = (options: ValidateOptions): options is OptionsWithOriginalDoc =>
  typeof options === 'object' && 'originalDoc' in options

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const toLocale = (value: unknown): Locale | undefined =>
  typeof value === 'string' && LOCALES.has(value as Locale) ? (value as Locale) : undefined

const toCollectionSlug = (value: unknown): CollectionSlugs | undefined =>
  typeof value === 'string' && COLLECTIONS.has(value as CollectionSlugs)
    ? (value as CollectionSlugs)
    : undefined

const normalizeString = (value: string): string | undefined => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

// Support text and upload-style values (string, number, or nested id/value objects).
const pickFirstLocalizedValue = (value: unknown): LocalizedFieldValue | undefined => {
  if (typeof value === 'string') return normalizeString(value)
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (Array.isArray(value)) {
    for (const entry of value) {
      const picked = pickFirstLocalizedValue(entry)
      if (picked !== undefined) return picked
    }
    return undefined
  }

  if (isRecord(value)) {
    if ('value' in value) {
      const picked = pickFirstLocalizedValue(value.value)
      if (picked !== undefined) return picked
    }
    if ('id' in value) {
      const picked = pickFirstLocalizedValue(value.id)
      if (picked !== undefined) return picked
    }
  }

  return undefined
}

const normalizeLocalizedValueMap = (input: unknown): Record<string, LocalizedFieldValue> => {
  const out: Record<string, LocalizedFieldValue> = {}
  if (!input || typeof input !== 'object') return out

  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!LOCALES.has(k as Locale)) continue
    const localizedValue = pickFirstLocalizedValue(v)
    if (localizedValue !== undefined) out[k] = localizedValue
  }

  return out
}

const valueAtPath = (source: unknown, path: (string | number)[]): unknown => {
  let current: unknown = source
  for (const segment of path) {
    if (!isRecord(current)) return undefined
    current = current[segment as keyof typeof current]
  }
  return current
}

const readQuery = (req: ValidateOptions['req']): UnknownRecord | undefined => {
  const q = req.query
  return isRecord(q) ? q : undefined
}

const readPublishSpecificLocale = (req: ValidateOptions['req']): Locale | undefined => {
  const q = readQuery(req)
  const raw = q?.publishSpecificLocale
  return toLocale(raw)
}
const readId = (source: unknown): string | number | undefined => {
  if (!isRecord(source)) return undefined
  const id = source.id
  return typeof id === 'string' || typeof id === 'number' ? id : undefined
}

const readStatus = (source: unknown): string | undefined => {
  if (!isRecord(source)) return undefined
  const status = source._status
  return typeof status === 'string' ? status : undefined
}

const readRouteParams = (req: ValidateOptions['req']): UnknownRecord | undefined => {
  if ('routeParams' in req && isRecord(req.routeParams)) {
    return req.routeParams as UnknownRecord
  }
  const params = (req as unknown as UnknownRecord).params
  return isRecord(params) ? params : undefined
}

/**
 * Determine which locales are being published
 */
const getLocalesToValidate = (options: ValidateOptions): Locale[] => {
  // 1) Locale-only publish: Payload sendet z.B. publishSpecificLocale=de
  const specific = readPublishSpecificLocale(options.req)
  if (specific) return [specific]

  // 2) Normaler Publish: prüfe alle Locales
  const targetStatus = readStatus(options.data) ?? readStatus(options.req.body)

  if (targetStatus !== 'published') return []
  return ALL_LOCALES
}

// --------------------
// Validator
// --------------------

const buildMissingLocalesMessage = (fieldLabel: string, missing: Locale[]): string => {
  const labels = missing.map((loc) => localeLabels[loc] ?? loc.toUpperCase())
  if (labels.length === 1) return `${fieldLabel} fehlt in ${labels[0]}`

  const last = labels.pop()
  return `${fieldLabel} fehlt in ${labels.join(', ')} und ${last}`
}

const buildLocalizedRequiredValidator =
  (fieldLabel: string): GenericLocalizedValidation =>
  async (value: ValidateValue, options: ValidateOptions) => {
    const localesToValidate = getLocalesToValidate(options)
    if (localesToValidate.length === 0) return true

    const path = Array.isArray(options.path) ? options.path : []
    const localizedValueMap: Record<string, LocalizedFieldValue> = {}

    // Merge locale maps from all request/document sources to avoid false negatives while editing.
    const mergeFrom = (source: unknown, customPath: (string | number)[] = path) => {
      Object.assign(localizedValueMap, normalizeLocalizedValueMap(valueAtPath(source, customPath)))
    }

    const originalDoc = hasOriginalDoc(options) ? options.originalDoc : undefined
    mergeFrom(originalDoc)
    mergeFrom(options.data)
    mergeFrom(options.req.body)

    if (isRecord(options.siblingData)) {
      if (path.length > 0) {
        const lastSegment = path[path.length - 1]
        mergeFrom(options.siblingData, [lastSegment])
      }
      Object.assign(localizedValueMap, normalizeLocalizedValueMap(options.siblingData))
    }

    // Ensure the currently edited locale value is considered even before Payload persists it.
    const activeLocale = toLocale(options.req.locale)
    const activeValue = pickFirstLocalizedValue(value)
    if (activeLocale && activeValue !== undefined) {
      localizedValueMap[activeLocale] = activeValue
    }

    const missingLocales = () =>
      localesToValidate.filter((loc) => localizedValueMap[loc] === undefined)
    let missing = missingLocales()

    const routeParams = readRouteParams(options.req)
    const currentId =
      options.id ?? readId(originalDoc) ?? readId(options.data) ?? readId(routeParams)
    const collection = toCollectionSlug(
      (options as { collectionSlug?: unknown }).collectionSlug ?? routeParams?.collectionSlug,
    )

    if (collection && currentId && missing.length > 0) {
      try {
        const doc = await options.req.payload.findByID({
          collection,
          id: currentId,
          draft: true,
          locale: 'all',
          depth: 0,
        })
        mergeFrom(doc)
        missing = missingLocales()
      } catch {
        // Ignore lookup errors and keep the in-request validation result.
      }
    }

    if (missing.length > 0) return buildMissingLocalesMessage(fieldLabel, missing)

    return true
  }

// Reusable factory for localized required fields (text, upload, relationship-like IDs).
export const createLocalizedRequiredValidator = <
  T extends TextFieldSingleValidation | UploadFieldSingleValidation,
>(
  fieldLabel: string,
): T => buildLocalizedRequiredValidator(fieldLabel) as T

export const localizedLabelRequired: TextFieldSingleValidation =
  createLocalizedRequiredValidator('Link-Label')

export const localizedDownloadFileRequired: UploadFieldSingleValidation =
  createLocalizedRequiredValidator('Download-Datei')
