import type { Locale } from "@/config/locales";

export interface NavStructure {
  id: string;
  subItems?: string[];
}

export const navStructure: NavStructure[] = [
  { id: "home" },
  {
    id: "about",
    subItems: ["about-what", "about-team", "about-wdo"],
  },
  {
    id: "programme",
    subItems: ["programme-overview", "programme-calendar"],
  },
  {
    id: "participants",
    subItems: ["participants-contributors", "participants-sponsors"],
  },
  {
    id: "materials",
    subItems: [
      "materials-merch",
      "materials-media",
      "materials-press",
      "materials-info",
    ],
  },
];

export interface NavContent {
  title: string;
  slug: string; // needs to be same of localized cms slug
}

export const navContent: Record<Locale, Record<string, NavContent>> = {
  de: {
    home: { title: "Home", slug: "" },
    about: { title: "Über uns", slug: "about" },
    "about-what": { title: "Was ist das?", slug: "ueber-uns" },
    "about-team": { title: "Team", slug: "team" },
    "about-wdo": {
      title: "World Design Organization",
      slug: "world-design-organization",
    },
    programme: { title: "Programm", slug: "programm" },
    "programme-overview": { title: "Übersicht", slug: "programm" },
    "programme-calendar": { title: "Kalender", slug: "kalender" },
    participants: { title: "Beteiligte", slug: "participants" },
    "participants-contributors": {
      title: "Programm-Macher:innen",
      slug: "programm-macherinnen",
    },
    "participants-sponsors": {
      title: "Förderer und Unterstützer",
      slug: "foerderer-und-unterstuetzer",
    },
    materials: { title: "Materialien", slug: "materialien" },
    "materials-merch": { title: "Merchandise", slug: "merch" },
    "materials-media": { title: "Mediathek", slug: "mediathek" },
    "materials-press": { title: "Presse", slug: "presse" },
    "materials-info": {
      title: "Informiert bleiben",
      slug: "informiert-bleiben",
    },
  },
  en: {
    home: { title: "Home", slug: "" },
    about: { title: "About", slug: "about" },
    "about-what": { title: "What is this?", slug: "about" },
    "about-team": { title: "Team", slug: "team" },
    "about-wdo": {
      title: "World Design Organization",
      slug: "world-design-organization",
    },
    programme: { title: "Programme", slug: "programme" },
    "programme-overview": { title: "Overview", slug: "programme" },
    "programme-calendar": { title: "Calendar", slug: "calendar" },
    participants: { title: "Contributors", slug: "participants" },
    "participants-contributors": {
      title: "Programme Contributors",
      slug: "programme-contributors",
    },
    "participants-sponsors": {
      title: "Funders and Supporters",
      slug: "funders-and-supporters",
    },
    materials: { title: "Materials", slug: "materials" },
    "materials-merch": { title: "Merchandise", slug: "merch" },
    "materials-media": { title: "Media Library", slug: "media-library" },
    "materials-press": { title: "Press", slug: "press" },
    "materials-info": { title: "Stay informed", slug: "stay-informed" },
  },
};

export interface NavItemEntry {
  id: string;
  title: string;
  link: string;
  subItems?: NavItemEntry[];
}

export function getNavItems(locale: Locale): NavItemEntry[] {
  const content = navContent[locale];

  function buildMenuItem(structureItem: NavStructure): NavItemEntry {
    const itemContent = content[structureItem.id];

    return {
      id: structureItem.id,
      title: itemContent.title,
      link: itemContent.slug ? `/${locale}/${itemContent.slug}` : `/${locale}`,
      subItems: structureItem.subItems?.map((subId) =>
        buildMenuItem({ id: subId }),
      ),
    };
  }

  return navStructure.map(buildMenuItem);
}
