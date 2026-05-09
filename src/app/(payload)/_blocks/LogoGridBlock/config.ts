// blocks/LogoGridBlock.ts

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block, FieldHook } from 'payload'

const defaultLogoSize = 'medium'

const ensureDefaultLogoSize: FieldHook = ({ value }) => {
  if (value === null) {
    return defaultLogoSize
  }
  return value
}

export const LogoGridBlock: Block = {
  slug: 'logoGridBlock',
  interfaceName: 'LogoGridBlock',
  labels: {
    singular: { en: 'Logo Grid', de: 'Logo Raster' },
    plural: { en: 'Logo Grids', de: 'Logo Raster' },
  },
  fields: [
    {
      name: 'sizes',
      type: 'select',
      options: [
        { label: { en: 'Small', de: 'Klein' }, value: 'small' },
        { label: { en: 'Medium', de: 'Mittel' }, value: 'medium' },
      ],
      defaultValue: defaultLogoSize,
      required: false,
      label: { en: 'Logo Sizes', de: 'Logo Größen' },
      hooks: {
        beforeValidate: [ensureDefaultLogoSize],
        beforeChange: [ensureDefaultLogoSize],
      },
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
          required: true,
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
  ],
}
