import type { LocalizedLabels } from "@/utils/i18n/collections";

import type { Locale } from "../locales";

export enum CollectionSlugs {
  Downloads = "downloads",
  Media = "media",
  Pages = "pages",
  Users = "users",
}

export const DEFAULT_APP_ROUTE_COLLECTION = (() => CollectionSlugs.Pages)();

export const collectionLabels: Record<CollectionSlugs, LocalizedLabels> = {
  [CollectionSlugs.Downloads]: {
    singular: { en: "Download", de: "Download" },
    plural: { en: "Downloads", de: "Downloads" },
  },
  [CollectionSlugs.Media]: {
    singular: { en: "Media", de: "Medien" },
    plural: { en: "Media", de: "Medien" },
  },
  [CollectionSlugs.Pages]: {
    singular: { en: "Page", de: "Seite" },
    plural: { en: "Pages", de: "Seiten" },
  },
  [CollectionSlugs.Users]: {
    singular: { en: "User", de: "Benutzer" },
    plural: { en: "Users", de: "Benutzer" },
  },
};

export const localizedCollectionsSlugs: Partial<
  Record<CollectionSlugs, Record<Locale, string>>
> = {};

export const localizedCollectionsWithStaticPaths: Record<
  never,
  Record<Locale, string>
> = {} as Record<never, Record<Locale, string>>;
