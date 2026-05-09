import type { Block } from 'payload'

import { localizedDownloadFileRequired } from '../../_utils/validateLocalizedLinkLabel'

export const DownloadBlock: Block = {
  slug: 'downloadBlock',
  interfaceName: 'Downloads',
  labels: {
    singular: { en: 'Download', de: 'Download' },
    plural: { en: 'Downloads', de: 'Downloads' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Titel',
        de: 'Titel',
      },
      required: false,
      localized: true,
    },
    {
      name: 'downloads',
      type: 'array',
      label: { en: 'Downloads', de: 'Downloads' },

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
  ],
}
