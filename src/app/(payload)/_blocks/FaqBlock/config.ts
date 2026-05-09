import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { link } from '@/fields/link'

export const FaqBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FaqBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      // required: true,
      localized: true,
      label: {
        en: 'Title',
        de: 'Titel',
      },
    },
    {
      type: 'array',
      name: 'faqs',
      fields: [
        {
          type: 'text',
          name: 'question',
          required: true,
          localized: true,
          label: {
            en: 'Question',
            de: 'Frage',
          },
        },
        {
          type: 'richText',
          name: 'answer',
          required: false,
          localized: true,
          label: {
            en: 'Answer',
            de: 'Antwort',
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
        {
          name: 'logos',
          type: 'array',
          label: { en: 'Logos', de: 'Logos' },
          labels: {
            singular: { en: 'Logo', de: 'Logo' },
            plural: { en: 'Logos', de: 'Logos' },
          },
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: { en: 'Logo', de: 'Logo' },
              admin: {
                description: { en: 'Allowed: SVG or PNG', de: 'Erlaubt: SVG oder PNG' },
              },
            },
            {
              name: 'text',
              type: 'richText',
              localized: true,
              label: { en: 'Text', de: 'Text' },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
            {
              name: 'url',
              type: 'text',
              required: false,
              label: { en: 'Link (optional)', de: 'Link (optional)' },
            },
          ],
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        link({
          overrides: {
            admin: {
              condition: (_: unknown, { enableLink }: { enableLink?: boolean }) =>
                Boolean(enableLink),
            },
          },
        }),
      ],
    },
  ],
}
