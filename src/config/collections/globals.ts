import type { GlobalConfig } from 'payload'

export enum GlobalCollectionSlugs {
  AppSettings = 'appSettings',
  Footer = 'footer',
}

export const globalCollectionLabels: Record<GlobalCollectionSlugs, GlobalConfig['label']> = {
  [GlobalCollectionSlugs.AppSettings]: {
    en: 'App settings',
    de: 'App-Einstellungen',
  },
  [GlobalCollectionSlugs.Footer]: {
    en: 'Footer',
    de: 'Fußzeile',
  },
}
