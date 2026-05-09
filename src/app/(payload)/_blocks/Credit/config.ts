import type { Block } from 'payload'

export const CreditBlock: Block = {
  slug: 'creditBlock',
  interfaceName: 'CreditBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'concatenate',
      options: [
        {
          label: 'Inherit from frame',
          value: 'inherit',
        },
        {
          label: 'Concatenate',
          value: 'concatenate',
        },
        {
          label: 'Overwrite',
          value: 'overwrite',
        },
      ],
    },
  ],
}
