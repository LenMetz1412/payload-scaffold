import type { Locale } from '@/config/locales'

export interface NavStructure {
  id: string
  subItems?: string[]
}

export const navStructure: NavStructure[] = [
  { id: 'home' },
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
}

export const navContent: Record<Locale, Record<string, NavContent>> = {
  de: {
    home: { title: 'Home', slug: '' },
    category1: { title: 'Category 1', slug: 'category1' },
    'subcategory1-1': { title: 'Subcategory 1-1', slug: 'subcategory1-1' },
    'subcategory1-2': { title: 'Subcategory 1-2', slug: 'subcategory1-2' },
    'subcategory1-3': {
      title: 'Subcategory 1-3',
      slug: 'subcategory1-3',
    },
    category2: { title: 'Category 2', slug: 'category2' },
    'subcategory2-1': { title: 'Subcategory 2-1', slug: 'subcategory2-1' },
    'subcategory2-2': { title: 'Subcategory 2-2', slug: 'subcategory2-2' },
    category3: { title: 'Category 3', slug: 'category3' },
    'subcategory3-1': {
      title: 'Subcategory 3-1',
      slug: 'subcategory3-1',
    },
    'subcategory3-2': {
      title: 'Subcategory 3-2',
      slug: 'subcategory3-2',
    },
    category4: { title: 'Category 4', slug: 'category4' },
    'subcategory4-1': { title: 'Subcategory 4-1', slug: 'subcategory4-1' },
    'subcategory4-2': { title: 'Subcategory 4-2', slug: 'subcategory4-2' },
    'subcategory4-3': { title: 'Subcategory 4-3', slug: 'subcategory4-3' },
    'subcategory4-4': {
      title: 'Subcategory 4-4',
      slug: 'subcategory4-4',
    },
  },
  en: {
    home: { title: 'Home', slug: '' },
    category1: { title: 'Category 1', slug: 'category1' },
    'subcategory1-1': { title: 'Subcategory 1-1', slug: 'subcategory1-1' },
    'subcategory1-2': { title: 'Subcategory 1-2', slug: 'subcategory1-2' },
    'subcategory1-3': {
      title: 'Subcategory 1-3',
      slug: 'subcategory1-3',
    },
    category2: { title: 'Category 2', slug: 'category2' },
    'subcategory2-1': { title: 'Subcategory 2-1', slug: 'subcategory2-1' },
    'subcategory2-2': { title: 'Subcategory 2-2', slug: 'subcategory2-2' },
    category3: { title: 'Category 3', slug: 'category3' },
    'subcategory3-1': {
      title: 'Subcategory 3-1',
      slug: 'subcategory3-1',
    },
    'subcategory3-2': {
      title: 'Subcategory 3-2',
      slug: 'subcategory3-2',
    },
    category4: { title: 'Category 4', slug: 'category4' },
    'subcategory4-1': { title: 'Subcategory 4-1', slug: 'subcategory4-1' },
    'subcategory4-2': { title: 'Subcategory 4-2', slug: 'subcategory4-2' },
    'subcategory4-3': {
      title: 'Subcategory 4-3',
      slug: 'subcategory4-3',
    },
    'subcategory4-4': {
      title: 'Subcategory 4-4',
      slug: 'subcategory4-4',
    },
  },
}

export interface NavItemEntry {
  id: string
  title: string
  link: string
  subItems?: NavItemEntry[]
}

export function getNavItems(locale: Locale): NavItemEntry[] {
  const content = navContent[locale]

  function buildMenuItem(structureItem: NavStructure): NavItemEntry {
    const itemContent = content[structureItem.id]

    return {
      id: structureItem.id,
      title: itemContent.title,
      link: itemContent.slug ? `/${locale}/${itemContent.slug}` : `/${locale}`,
      subItems: structureItem.subItems?.map((subId) => buildMenuItem({ id: subId })),
    }
  }

  return navStructure.map(buildMenuItem)
}
