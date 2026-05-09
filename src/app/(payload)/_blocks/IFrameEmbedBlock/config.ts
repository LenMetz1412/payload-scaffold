import type { Block } from 'payload'

export const IFrameEmbedBlock: Block = {
  slug: 'iframeEmbedBlock',
  interfaceName: 'iframeEmbedBlock',
  fields: [
    {
      name: 'src',
      label: {
        en: 'Embed URL',
        de: 'Einbettungs-URL',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      label: {
        en: 'Title',
        de: 'Titel',
      },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'for accessibility',
          de: 'für die Barrierefreiheit',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          label: { en: 'Width', de: 'Breite' },
          type: 'number',
          defaultValue: 640,
          required: true,
        },
        {
          name: 'height',
          label: { en: 'Height', de: 'Höhe' },
          type: 'number',
          defaultValue: 720,
          required: true,
        },
      ],
    },
  ],
}
