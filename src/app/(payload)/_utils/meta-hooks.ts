import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Automatically fills meta.title and meta.description from the document's
 * title and description fields if the meta fields are empty.
 */
export const autoFillMetaHook: CollectionBeforeChangeHook = ({ data }) => {
  if (!data.meta) data.meta = {}

  if (!data.meta.title && data.title) {
    data.meta.title = data.title
  }

  if (!data.meta.description && data.description) {
    data.meta.description = data.description
  }

  return data
}
