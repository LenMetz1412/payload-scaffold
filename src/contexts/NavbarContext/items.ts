import type { Locale } from '@/config/locales'

export interface NavStructure {
  id: string
  subItems?: string[]
}

export const navStructure: NavStructure[] = [
  {
    id: 'category1',
    subItems: ['subcategory1-1', 'subcategory1-2', 'subcategory1-3'],
  },
  {
    id: 'category2',
    subItems: ['subcategory2-1', 'subcategory2-2'],
  },
  {
    id: 'category3',
    subItems: ['subcategory3-1', 'subcategory3-2'],
  },
  {
    id: 'category4',
    subItems: ['subcategory4-1', 'subcategory4-2', 'subcategory4-3', 'subcategory4-4'],
  },
]

export interface NavContent {
  title: string
  slug: string // needs to be same of localized cms slug
  description?: string
}

export const navContent: Record<Locale, Record<string, NavContent>> = {
  de: {
    category1: { title: 'Category 1', slug: 'category1' },
    'subcategory1-1': { title: 'Subcategory 1-1', slug: 'subcategory1-1', description: 'Kurze Beschreibung der Unterkategorie 1-1' },
    'subcategory1-2': { title: 'Subcategory 1-2', slug: 'subcategory1-2', description: 'Kurze Beschreibung der Unterkategorie 1-2' },
    'subcategory1-3': { title: 'Subcategory 1-3', slug: 'subcategory1-3', description: 'Kurze Beschreibung der Unterkategorie 1-3' },
    category2: { title: 'Category 2', slug: 'category2' },
    'subcategory2-1': { title: 'Subcategory 2-1', slug: 'subcategory2-1', description: 'Kurze Beschreibung der Unterkategorie 2-1' },
    'subcategory2-2': { title: 'Subcategory 2-2', slug: 'subcategory2-2', description: 'Kurze Beschreibung der Unterkategorie 2-2' },
    category3: { title: 'Category 3', slug: 'category3' },
    'subcategory3-1': { title: 'Subcategory 3-1', slug: 'subcategory3-1', description: 'Kurze Beschreibung der Unterkategorie 3-1' },
    'subcategory3-2': { title: 'Subcategory 3-2', slug: 'subcategory3-2', description: 'Kurze Beschreibung der Unterkategorie 3-2' },
    category4: { title: 'Category 4', slug: 'category4' },
    'subcategory4-1': { title: 'Subcategory 4-1', slug: 'subcategory4-1', description: 'Kurze Beschreibung der Unterkategorie 4-1' },
    'subcategory4-2': { title: 'Subcategory 4-2', slug: 'subcategory4-2', description: 'Kurze Beschreibung der Unterkategorie 4-2' },
    'subcategory4-3': { title: 'Subcategory 4-3', slug: 'subcategory4-3', description: 'Kurze Beschreibung der Unterkategorie 4-3' },
    'subcategory4-4': { title: 'Subcategory 4-4', slug: 'subcategory4-4', description: 'Kurze Beschreibung der Unterkategorie 4-4' },
  },
  en: {
    category1: { title: 'Category 1', slug: 'category1' },
    'subcategory1-1': { title: 'Subcategory 1-1', slug: 'subcategory1-1', description: 'Short description of subcategory 1-1' },
    'subcategory1-2': { title: 'Subcategory 1-2', slug: 'subcategory1-2', description: 'Short description of subcategory 1-2' },
    'subcategory1-3': { title: 'Subcategory 1-3', slug: 'subcategory1-3', description: 'Short description of subcategory 1-3' },
    category2: { title: 'Category 2', slug: 'category2' },
    'subcategory2-1': { title: 'Subcategory 2-1', slug: 'subcategory2-1', description: 'Short description of subcategory 2-1' },
    'subcategory2-2': { title: 'Subcategory 2-2', slug: 'subcategory2-2', description: 'Short description of subcategory 2-2' },
    category3: { title: 'Category 3', slug: 'category3' },
    'subcategory3-1': { title: 'Subcategory 3-1', slug: 'subcategory3-1', description: 'Short description of subcategory 3-1' },
    'subcategory3-2': { title: 'Subcategory 3-2', slug: 'subcategory3-2', description: 'Short description of subcategory 3-2' },
    category4: { title: 'Category 4', slug: 'category4' },
    'subcategory4-1': { title: 'Subcategory 4-1', slug: 'subcategory4-1', description: 'Short description of subcategory 4-1' },
    'subcategory4-2': { title: 'Subcategory 4-2', slug: 'subcategory4-2', description: 'Short description of subcategory 4-2' },
    'subcategory4-3': { title: 'Subcategory 4-3', slug: 'subcategory4-3', description: 'Short description of subcategory 4-3' },
    'subcategory4-4': { title: 'Subcategory 4-4', slug: 'subcategory4-4', description: 'Short description of subcategory 4-4' },
  },
}

export interface FlyoutArticle {
  id: string
  title: string
  imageUrl?: string | null
  href: string
}

export interface NavItemEntry {
  id: string
  title: string
  link: string
  description?: string
  subItems?: NavItemEntry[]
  featuredArticles?: FlyoutArticle[]
}

export function getNavItems(locale: Locale): NavItemEntry[] {
  const content = navContent[locale]

  function buildMenuItem(structureItem: NavStructure): NavItemEntry {
    const itemContent = content[structureItem.id]

    return {
      id: structureItem.id,
      title: itemContent.title,
      link: itemContent.slug ? `/${locale}/${itemContent.slug}` : `/${locale}`,
      description: itemContent.description,
      subItems: structureItem.subItems?.map((subId) => buildMenuItem({ id: subId })),
    }
  }

  return navStructure.map(buildMenuItem)
}
