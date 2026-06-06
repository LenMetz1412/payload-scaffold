import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const GoogleReviewsBlock: Block = {
  slug: 'googleReviewsBlock',
  interfaceName: 'GoogleReviewsBlock',
  labels: {
    singular: { en: 'Google Reviews', de: 'Google Bewertungen' },
    plural: { en: 'Google Reviews', de: 'Google Bewertungen' },
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BlocksFeature({ blocks: [] }),
        ],
      }),
      localized: true,
      label: { en: 'Title', de: 'Titel' },
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
      defaultValue: 'manual',
      options: [
        { label: { en: 'Manual (enter reviews in CMS)', de: 'Manuell (Bewertungen im CMS eingeben)' }, value: 'manual' },
        { label: { en: 'Google Places API', de: 'Google Places API' }, value: 'google' },
      ],
    },

    // ── Manual mode ────────────────────────────────────────────────
    {
      name: 'reviews',
      type: 'array',
      label: { en: 'Reviews', de: 'Bewertungen' },
      admin: {
        condition: (_, s) => s?.source !== 'google',
      },
      fields: [
        {
          name: 'authorName',
          type: 'text',
          required: true,
          label: { en: 'Name', de: 'Name' },
        },
        {
          name: 'rating',
          type: 'select',
          required: true,
          label: { en: 'Rating', de: 'Bewertung' },
          defaultValue: '5',
          options: ['5', '4', '3', '2', '1'].map((v) => ({ label: `${v} ★`, value: v })),
        },
        {
          name: 'reviewText',
          type: 'textarea',
          required: true,
          label: { en: 'Review text', de: 'Bewertungstext' },
          localized: true,
        },
        {
          name: 'date',
          type: 'text',
          required: false,
          label: { en: 'Date (displayed as-is, e.g. "2 months ago")', de: 'Datum (wird so angezeigt, z. B. „vor 2 Monaten")' },
          localized: true,
        },
      ],
    },

    // ── Google Places API mode ─────────────────────────────────────
    {
      name: 'placeId',
      type: 'text',
      required: false,
      label: { en: 'Google Place ID', de: 'Google Place ID' },
      admin: {
        condition: (_, s) => s?.source === 'google',
        description: {
          en: 'Find your Place ID at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder',
          de: 'Place ID unter https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder finden',
        },
      },
    },
    {
      name: 'minRating',
      type: 'select',
      label: { en: 'Minimum rating', de: 'Mindestbewertung' },
      defaultValue: '1',
      admin: {
        condition: (_, s) => s?.source === 'google',
      },
      options: [
        { label: { en: 'All ratings', de: 'Alle Bewertungen' }, value: '1' },
        { label: { en: '3★ and above', de: '3★ und höher' }, value: '3' },
        { label: { en: '4★ and above', de: '4★ und höher' }, value: '4' },
        { label: { en: '5★ only', de: 'Nur 5★' }, value: '5' },
      ],
    },
  ],
}
