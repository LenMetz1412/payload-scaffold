import type { GlobalConfig } from 'payload'

import { GlobalCollectionSlugs } from '@/config/collections/globals'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { draftVersions } from '@/payload/utils/collection-config'
import {
  getGlobalCollectionAdminConfig,
  getGlobalCollectionConfig,
} from '@/payload/utils/global-config'

import { MetaFieldset } from '../_fields/meta'

export const AppSettings: GlobalConfig = {
  ...getGlobalCollectionConfig(GlobalCollectionSlugs.AppSettings),

  versions: draftVersions,
  admin: getGlobalCollectionAdminConfig(GlobalCollectionSlugs.AppSettings, AdminPanelsGroups.Admin),
  lockDocuments: { duration: 600 },
  fields: [
    MetaFieldset,
    {
      name: 'navbar',
      type: 'group',
      label: { en: 'Navigation', de: 'Navigation' },
      fields: [
        {
          name: 'items',
          type: 'array',
          label: { en: 'Nav items', de: 'Navigationspunkte' },
          admin: {
            description: {
              en: 'Top-level categories. Each becomes a dropdown — no direct link.',
              de: 'Kategorien der obersten Ebene. Jede wird zu einem Dropdown — kein direkter Link.',
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', de: 'Titel' },
            },
            {
              name: 'subItems',
              type: 'array',
              label: { en: 'Sub-items', de: 'Unterpunkte' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Title', de: 'Titel' },
                },
                {
                  name: 'description',
                  type: 'text',
                  localized: true,
                  label: { en: 'Description', de: 'Beschreibung' },
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  label: { en: 'Link to page', de: 'Verlinkung zur Seite' },
                },
                {
                  name: 'customUrl',
                  type: 'text',
                  label: { en: 'Custom URL (if no page selected)', de: 'Eigene URL (wenn keine Seite gewählt)' },
                },
              ],
            },
            {
              name: 'featuredArticles',
              type: 'array',
              label: { en: 'Featured articles', de: 'Vorgestellte Artikel' },
              maxRows: 4,
              admin: {
                description: {
                  en: 'Pages shown in the "Latest articles" panel for this category\'s dropdown.',
                  de: 'Seiten, die im „Aktuelle Artikel"-Bereich dieses Kategorie-Dropdowns angezeigt werden.',
                },
              },
              fields: [
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  label: { en: 'Page', de: 'Seite' },
                },
                {
                  name: 'overrideTitle',
                  type: 'text',
                  localized: true,
                  label: { en: 'Override title', de: 'Titel überschreiben' },
                },
                {
                  name: 'overrideImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: { en: 'Override image', de: 'Bild überschreiben' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'instagram',
      type: 'group',
      label: { en: 'Instagram', de: 'Instagram' },
      admin: {
        description: {
          en: 'Long-lived access token for the Instagram Graph API. Refreshed automatically every 30 days via cron.',
          de: 'Long-lived Access Token für die Instagram Graph API. Wird automatisch alle 30 Tage per Cron erneuert.',
        },
      },
      fields: [
        {
          name: 'accessToken',
          type: 'text',
          label: { en: 'Access Token', de: 'Access Token' },
          admin: {
            description: {
              en: 'Paste your initial long-lived token here. The cron job will keep it refreshed.',
              de: 'Initialen Long-lived Token hier einfügen. Der Cron-Job hält ihn aktuell.',
            },
          },
        },
        {
          name: 'tokenExpiresAt',
          type: 'date',
          label: { en: 'Token expires at', de: 'Token läuft ab am' },
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'lastRefreshedAt',
          type: 'date',
          label: { en: 'Last refreshed', de: 'Zuletzt erneuert' },
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
  ],
}
