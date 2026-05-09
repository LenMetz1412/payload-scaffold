import type { CollectionSlug, Field, FieldHook, TextFieldSingleValidation } from 'payload'

import deepMerge from '@/payload/utils/deep-merge'

import { localizedLabelRequired } from '../_utils/validateLocalizedLinkLabel'

export type LinkAppearances = 'filled' | 'outline'
type TextValue = Parameters<TextFieldSingleValidation>[0]

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  filled: {
    label: 'Filled',
    value: 'filled',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    hooks: {
      beforeValidate: [normalizeLink],
      beforeChange: [normalizeLink],
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages'] as CollectionSlug[],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
      validate: (value: TextValue) => {
        if (value && !/^https?:\/\//i.test(value)) {
          console.log('URL must start with http:// or https://')
          return 'URL must start with http:// or https://'
        }
        return true
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value && !/^https?:\/\//i.test(value)) {
              return `http://${value}`
            }
            return value
          },
        ],
      },
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
          localized: true,
          validate: localizedLabelRequired,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.filled, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'outline',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

const normalizeLink: FieldHook = ({ value }) => {
  if (!value) return value
  const next = { ...value }

  if (next.type === 'reference') {
    next.url = null
  } else if (next.type === 'custom') {
    next.reference = null
  }

  return next
}
