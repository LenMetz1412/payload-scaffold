import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type { GroupField } from 'payload'

export const MetaFieldset = ((): GroupField => ({
  name: 'meta',
  label: 'SEO',
  type: 'group',
  interfaceName: 'MetaFieldset',
  localized: true,
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      // imagePath: 'meta.image', // -> migration needed
      imagePath: 'meta.customMetaImage', // -> migration not needed
    }),
    MetaTitleField({
      hasGenerateFn: true,
    }),
    MetaImageField({
      hasGenerateFn: false,
      relationTo: 'media',
      overrides: {
        name: 'customMetaImage',
        label: 'Custom Meta Image',
        admin: {
          description:
            'Upload an image to be used specifically for SEO purposes. If not provided, the default Hero image will be used.',
        },
      },
    }),

    MetaDescriptionField({
      hasGenerateFn: true,
    }),
    PreviewField({
      // if the `generateUrl` function is configured
      hasGenerateFn: true,

      // field paths to match the target field for data
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
}))()
