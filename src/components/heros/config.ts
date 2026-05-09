import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  interfaceName: 'HeroField',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'lowImpact',
          label: 'Type',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'High Impact',
              value: 'highImpact',
            },
            {
              label: 'Medium Impact',
              value: 'mediumImpact',
            },
            {
              label: 'Low Impact',
              value: 'lowImpact',
            },
          ],
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          label: 'Theme',
          options: [
            {
              label: 'Dark',
              value: 'dark',
            },
            {
              label: 'light',
              value: 'light',
            },
          ],
          required: true,
          admin: {
            width: '50%',
            condition: (_, { type } = {}) => ['highImpact'].includes(type),
          },
        },
        {
          name: 'imageOverlay',
          type: 'radio',
          defaultValue: 'original',
          label: {
            en: 'Darken / Lighten Image',
            de: 'Bild abdunkeln / aufhellen',
          },
          options: [
            {
              label: {
                en: 'Original image',
                de: 'Originalbild',
              },
              value: 'original',
            },
            {
              label: {
                en: 'Darken',
                de: 'Abdunkeln',
              },
              value: 'darken',
            },
            {
              label: {
                en: 'Lighten',
                de: 'Aufhellen',
              },
              value: 'lighten',
            },
          ],
          admin: {
            width: '50%',
            condition: (_, { type } = {}) => ['highImpact'].includes(type),
          },
        },
        {
          name: 'blockHeight',
          type: 'select',
          defaultValue: 'full',
          label: {
            en: 'Height',
            de: 'Höhe',
          },
          options: [
            {
              label: { en: 'Full', de: 'Groß' },
              value: 'full',
            },
            {
              label: { en: 'Medium', de: 'Mittel' },
              value: 'medium',
            },
            {
              label: { en: 'Small', de: 'Klein' },
              value: 'small',
            },
          ],
          admin: {
            width: '50%',
            condition: (_, { type } = {}) => ['highImpact'].includes(type),
          },
        },
      ],
    },
    {
      type: 'array',
      name: 'slide',
      admin: {
        width: '50%',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      fields: [
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          localized: true,
          label: false,
        },
        linkGroup({
          overrides: {
            maxRows: 2,
          },
        }),
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          maxDepth: 3,
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        width: '50%',
        condition: (_, { type } = {}) => ['lowImpact'].includes(type),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      localized: true,
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          width: '50%',
          condition: (_, { type } = {}) => ['lowImpact'].includes(type),
        },
      },
    }),
  ],
  label: false,
}
