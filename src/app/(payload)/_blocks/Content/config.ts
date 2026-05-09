import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block, Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

import { localizedDownloadFileRequired } from '../../_utils/validateLocalizedLinkLabel'

const columnFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'size',
        type: 'select',
        defaultValue: 'oneThird',
        options: [
          {
            label: {
              en: 'One Third',
              de: 'Ein Drittel',
            },
            value: 'oneThird',
          },
          {
            label: { en: 'Half', de: 'Halb' },
            value: 'half',
          },
          {
            label: { en: 'Two Thirds', de: 'Zwei Drittel' },
            value: 'twoThirds',
          },
          {
            label: { en: 'Full', de: 'Ganz' },
            value: 'full',
          },
        ],
        admin: {
          width: '50%',
        },
      },
      {
        name: 'startNewRow',
        label: {
          en: 'Start New Row',
          de: 'Neue Zeile starten',
        },
        type: 'checkbox',
        admin: {
          width: '50%',
          style: {
            padding: '2.7em 0 0 0',
          },
        },
      },
    ],
  },
  {
    name: 'media',
    type: 'upload',
    label: 'Media',
    relationTo: 'media',
    required: false,
  },
  {
    name: 'layoutOptions',
    type: 'select',
    label: {
      en: 'Layout Options',
      de: 'Layout Optionen',
    },
    options: [
      {
        label: { en: 'Image / Text', de: 'Bild / Text' },
        value: 'imageAbove',
      },
      {
        label: { en: 'Text / Image', de: 'Text / Bild' },
        value: 'imageBelow',
      },
    ],
    defaultValue: 'imageAbove',
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BlocksFeature({
            blocks: [],
          }),
        ]
      },
    }),
    label: false,
    localized: true,
    hooks: {
      afterRead: [
        ({ value }) => {
          if (!value || typeof value !== 'object') return value
          const root = value.root
          if (!root || typeof root !== 'object') return null
          if (!Array.isArray(root.children) || root.children.length === 0) return null
          return value
        },
      ],
    },
  },

  {
    name: 'enableLink',
    type: 'checkbox',
  },

  linkGroup({
    overrides: {
      admin: {
        condition: (_, { enableLink }: { enableLink?: boolean }) => Boolean(enableLink),
      },
    },
  }),

  {
    name: 'enableDownload',
    type: 'checkbox',
  },

  {
    name: 'downloads',
    type: 'array',
    label: { en: 'Downloads', de: 'Downloads' },
    admin: {
      condition: (_, { enableDownload }: { enableDownload?: boolean }) => Boolean(enableDownload),
    },

    fields: [
      {
        name: 'label',
        type: 'text',
        label: { en: 'Label', de: 'Beschriftung' },
        required: true,
        localized: true,
      },
      {
        name: 'downloadFile',
        type: 'upload',
        relationTo: 'downloads',
        label: {
          en: 'Download File',
          de: 'Download Datei',
        },
        required: true,
        hasMany: false,
        localized: true,
        validate: localizedDownloadFileRequired,
      },
    ],
  },
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'collapsible',
      type: 'checkbox',
      label: {
        en: 'Collapsible',
        de: 'Zusammenklappbar',
      },
      admin: {
        width: '50%',
        style: {},
      },
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
