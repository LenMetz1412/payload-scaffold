import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const SocialFeedBlock: Block = {
  slug: 'socialFeedBlock',
  interfaceName: 'SocialFeedBlock',
  labels: {
    singular: { en: 'Social Feed', de: 'Social Feed' },
    plural: { en: 'Social Feeds', de: 'Social Feeds' },
  },
  fields: [
    {
      name: 'title',
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
      localized: true,
      label: {
        en: 'Title',
        de: 'Titel',
      },
    },
    {
      name: 'displayMode',
      type: 'select',
      label: { en: 'Display mode', de: 'Anzeigemodus' },
      defaultValue: 'carousel',
      options: [
        { label: { en: 'Carousel', de: 'Karussell' }, value: 'carousel' },
        { label: { en: 'Grid', de: 'Raster' }, value: 'grid' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: { en: 'Source', de: 'Quelle' },
      defaultValue: 'instagram',
      options: [
        {
          label: { en: 'Instagram Feed (Graph API)', de: 'Instagram Feed (Graph API)' },
          value: 'instagram',
        },
        {
          label: { en: 'Manual (individual embeds)', de: 'Manuell (einzelne Einbettungen)' },
          value: 'manual',
        },
      ],
      admin: {
        description: {
          en: 'Instagram: pulls your feed automatically via the Graph API (requires INSTAGRAM_ACCESS_TOKEN in .env). Manual: paste individual embed codes.',
          de: 'Instagram: ruft den Feed automatisch über die Graph API ab (INSTAGRAM_ACCESS_TOKEN in .env erforderlich). Manuell: einzelne Embed-Codes einfügen.',
        },
      },
    },
    // ── Instagram feed mode ────────────────────────────────────────
    {
      name: 'postCount',
      type: 'number',
      label: { en: 'Number of posts', de: 'Anzahl Beiträge' },
      defaultValue: 6,
      min: 1,
      max: 24,
      admin: {
        condition: (_, s) => s?.source === 'instagram',
        description: {
          en: 'How many of the latest posts to display.',
          de: 'Wie viele der neuesten Beiträge angezeigt werden sollen.',
        },
      },
    },
    // ── Manual mode ────────────────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      label: { en: 'Posts', de: 'Beiträge' },
      admin: {
        condition: (_, s) => s?.source === 'manual',
        description: {
          en: 'Paste the full embed code from Instagram ("Copy embed code") or TikTok.',
          de: 'Vollständigen Einbettungscode von Instagram oder TikTok einfügen.',
        },
      },
      fields: [
        {
          name: 'embedCode',
          type: 'code',
          label: { en: 'Embed Code', de: 'Einbettungscode' },
          required: true,
          admin: { language: 'html' },
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          required: false,
          label: { en: 'Caption (optional)', de: 'Beschriftung (optional)' },
        },
      ],
    },
  ],
}
