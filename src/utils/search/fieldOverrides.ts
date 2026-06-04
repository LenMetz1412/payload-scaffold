import type { Field } from 'payload'

export const searchFieldsOverrides: Field[] = [
  {
    name: 'description',
    type: 'text',
    index: true,
    localized: true,
    admin: { readOnly: true },
  },
  {
    name: 'collections',
    type: 'text',
    index: true,
    admin: { readOnly: true, position: 'sidebar' },
  },
  {
    name: 'slug',
    type: 'text',
    index: true,
    localized: true,
    admin: { readOnly: true, position: 'sidebar' },
  },
  {
    name: '_status',
    type: 'text',
    index: true,
    admin: { readOnly: true, position: 'sidebar' },
  },
  {
    name: 'heroImageUrl',
    type: 'text',
    admin: { readOnly: true },
  },
  {
    name: 'heroImageAlt',
    type: 'text',
    admin: { readOnly: true },
  },
  {
    name: 'heroRichText',
    type: 'textarea',
    index: true,
    localized: true,
    admin: { readOnly: true },
  },
  {
    name: 'contentBlock',
    type: 'array',
    localized: true,
    fields: [
      {
        name: 'blockIndex',
        type: 'number',
        admin: { readOnly: true },
        hidden: true,
      },
      {
        name: 'cols',
        type: 'array',
        fields: [
          {
            name: 'colIndex',
            type: 'number',
            admin: { readOnly: true },
            hidden: true,
          },
          {
            name: 'text',
            type: 'textarea',
            index: true,
            localized: true,
            admin: { readOnly: true },
          },
        ],
      },
    ],
    admin: { readOnly: true },
  },
  {
    name: 'faqBlock',
    type: 'array',
    localized: true,
    fields: [
      {
        name: 'question',
        type: 'textarea',
        index: true,
        localized: true,
        admin: { readOnly: true },
      },
      {
        name: 'answer',
        type: 'textarea',
        index: true,
        localized: true,
        admin: { readOnly: true },
      },
    ],
    admin: { readOnly: true },
  },
]
