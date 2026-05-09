import type { CheckboxField, TextField } from 'payload'

import type { CollectionSlugs } from '@/config/collections'

import { uniqueSlugValidate } from '../../_utils/slugUniqueness'
import { formatSlugHook } from './formatSlug'

interface Overrides {
  slugOverrides?: Partial<TextField>
  checkboxOverrides?: Partial<CheckboxField>
  collectionForUniqueness: CollectionSlugs
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides: any) => {
  const { slugOverrides, checkboxOverrides, collectionForUniqueness } = overrides

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  }

  const baseSlugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Slug',
    localized: true,
    validate: uniqueSlugValidate(collectionForUniqueness),
    unique: true,
    hooks: {
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: 'sidebar',
      components: {
        Field: {
          path: '@/fields/slug/SlugComponent#SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name,
          },
        },
      },
    },
  }

  return [baseSlugField, checkBoxField]
}
