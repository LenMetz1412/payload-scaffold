import type { TextFieldSingleValidation, Where } from 'payload'
import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'

const LOCALES = new Set<Locale>(locales)
const localeLabels: Record<Locale, string> = { de: 'Deutsch', en: 'English' }
type ValidateFn = TextFieldSingleValidation
type ValidateValue = Parameters<ValidateFn>[0]
type ValidateOptions = Parameters<ValidateFn>[1]
type UnknownRecord = Record<string, unknown>
type OptionsWithOriginalDoc = ValidateOptions & { originalDoc?: UnknownRecord }

const hasOriginalDoc = (options: ValidateOptions): options is OptionsWithOriginalDoc =>
  typeof options === 'object' && options !== null && 'originalDoc' in options

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const readStatus = (source: unknown): string | undefined => {
  if (!isRecord(source)) return undefined
  const status = source._status
  return typeof status === 'string' ? status : undefined
}

const readId = (source: unknown): string | number | undefined => {
  if (!isRecord(source)) return undefined
  const id = source.id
  return typeof id === 'string' || typeof id === 'number' ? id : undefined
}

const readSlugValue = (source: unknown): unknown => (isRecord(source) ? source.slug : undefined)

const readRouteParams = (req: ValidateOptions['req']): UnknownRecord | undefined => {
  if (!req) return undefined
  if ('routeParams' in req && isRecord(req.routeParams)) {
    return req.routeParams
  }
  const params = (req as unknown as UnknownRecord).params
  return isRecord(params) ? params : undefined
}

const toLocale = (value: unknown): Locale | undefined =>
  typeof value === 'string' && LOCALES.has(value as Locale) ? (value as Locale) : undefined

const isLocaleEntry = (entry: [string, string]): entry is [Locale, string] =>
  LOCALES.has(entry[0] as Locale) && entry[1].trim() !== ''

function pickFirstString(x: unknown): string | undefined {
  if (typeof x === 'string') return x
  if (Array.isArray(x)) return x.find((v) => typeof v === 'string') as string | undefined
  return undefined
}
function normalizeSlugMap(input: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!input || typeof input !== 'object') return out
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!LOCALES.has(k as Locale)) continue
    const s = pickFirstString(v)
    if (s?.trim()) out[k] = s.trim()
  }
  return out
}

export const uniqueSlugValidate =
  (collection: CollectionSlugs): ValidateFn =>
  async (value: ValidateValue, options: ValidateOptions) => {
    const targetStatus = readStatus(options.data) ?? readStatus(options.req?.body)
    const originalDoc = hasOriginalDoc(options) ? options.originalDoc : undefined

    // Nur beim Publish prüfen, wichtig
    if (targetStatus !== 'published') {
      return true
    }

    const slugMap: Record<string, string> = {}

    // 1) alles mergen, was wir eh schon haben
    Object.assign(slugMap, normalizeSlugMap(readSlugValue(originalDoc)))
    const siblingSlug = readSlugValue(options.siblingData)
    const dataSlug = readSlugValue(options.data)
    Object.assign(slugMap, normalizeSlugMap(siblingSlug ?? dataSlug))

    const activeLocale = toLocale(options.req?.locale)
    const activeVal = pickFirstString(value)
    if (activeLocale && activeVal) {
      slugMap[activeLocale] = activeVal.trim()
    }

    // 2) Falls uns eine oder mehrere Sprachen fehlen und wir eine ID haben:
    //    Doc als DRAFT mit locale:'all' aus der DB laden und mergen.
    const currentId =
      options.id ??
      readId(originalDoc) ??
      readId(options.data) ??
      readId(readRouteParams(options.req))

    const missing = [...LOCALES].filter((loc) => !slugMap[loc])
    if (currentId && missing.length > 0) {
      try {
        const doc = await options.req.payload.findByID({
          collection,
          id: currentId,
          draft: true, // das ist wichtig, da wenn in der nicht-aktiven-sprache ein duplikat eingibt und noch nicht publiziert  und dann die sprache wechselt und dann auf publich klickt, dann möchte man den duplikat nicht zulassen
          locale: 'all', // alle Locales laden
          depth: 0,
        })
        Object.assign(slugMap, normalizeSlugMap(readSlugValue(doc)))
      } catch (_e) {}
    }

    const entries = Object.entries(slugMap).filter(isLocaleEntry)

    if (entries.length === 0) return true

    // je Locale gegen bereits veröffentlichte prüfen
    for (const [loc, val] of entries) {
      const clauses: Where[] = []
      if (currentId) {
        clauses.push({ id: { not_equals: currentId } })
      }
      clauses.push({ _status: { equals: 'published' } }, { [`slug.${loc}`]: { equals: val } })
      const where: Where = { and: clauses }

      const res = await options.req.payload.find({
        collection,
        where,
        limit: 2,
      })

      if (res.totalDocs > 0) {
        const label = localeLabels[loc] ?? loc.toUpperCase()
        return `Der Slug (${label}) „${val}“ existiert bereits.`
      }
    }

    return true
  }
