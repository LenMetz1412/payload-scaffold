import type { Block } from 'payload'

export const SpaceBlock: Block = {
  slug: 'spaceBlock',
  interfaceName: 'SpaceBlock',
  labels: {
    singular: { en: 'Space', de: 'Abstand' },
    plural: { en: 'Spaces', de: 'Abstände' },
  },
  fields: [
    {
      name: 'size',
      type: 'select',
      label: { en: 'Size', de: 'Größe' },
      defaultValue: 'medium',
      options: [
        { label: { en: 'Small', de: 'Klein' }, value: 'small' },
        { label: { en: 'Medium', de: 'Mittel' }, value: 'medium' },
        { label: { en: 'Large', de: 'Groß' }, value: 'large' },
      ],
    },
  ],
}
