import type { BaseDocument } from './base-document'

/**
 * Retrieves the slug or ID of a document, prioritizing the slug.
 *
 * @param {BaseDocument | null} [doc] - The document to retrieve the slug or ID from.
 * @returns {string | undefined} - The slug if available, otherwise the ID, or undefined if neither is present.
 */
export const getDocSlugOrId = (doc?: BaseDocument | null) =>
  [doc?.slug?.trim(), doc?.id].filter((a) => !!a).shift()
