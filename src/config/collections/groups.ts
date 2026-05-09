import type { CollectionConfig } from 'payload'

export enum AdminPanelsGroups {
  Admin = 'admin',
  Main = 'main',
  Media = 'media',
  Taxonomy = 'taxonomy',
}

export const adminPanelsGroups: Record<
  AdminPanelsGroups,
  NonNullable<CollectionConfig['admin']>['group']
> = {
  [AdminPanelsGroups.Admin]: {
    en: 'Admin',
    de: 'Verwaltung',
  },
  [AdminPanelsGroups.Main]: {
    en: 'Collections',
    de: 'Sammlungen',
  },
  [AdminPanelsGroups.Media]: {
    en: 'Media',
    de: 'Medien',
  },
  [AdminPanelsGroups.Taxonomy]: {
    en: 'Taxonomy',
    de: 'Taxonomie',
  },
}
