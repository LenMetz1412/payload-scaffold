import type { Block } from 'payload'

export const GapBlock: Block = {
  slug: 'gapBlock',
  interfaceName: 'GapBlock',
  fields: [
    {
      type: 'select',
      name: 'gapSize',
      label: {
        en: 'Gap Size',
        de: 'Abstand',
      },
      defaultValue: 'md',
      options: [
        {
          label: {
            en: 'Small',
            de: 'Klein',
          },
          value: 'sm',
        },
        {
          label: {
            en: 'Medium',
            de: 'Mittel',
          },
          value: 'md',
        },
        {
          label: {
            en: 'Large',
            de: 'Groß',
          },
          value: 'lg',
        },
        {
          label: {
            en: 'Extra Large',
            de: 'Extra Groß',
          },
          value: 'xl',
        },
      ],
    },
  ],
}
