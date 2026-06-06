'use client'

import Link from 'next/link'

import type { FlyoutArticle, NavItemEntry } from '@/contexts/NavbarContext/items'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/sha/navigation-menu'
import { cn } from '@/utils/cn'

import { useIsCurrentNavItem } from '../shared/use-is-current'

// ── Mega-menu item ────────────────────────────────────────────────────────────

export const MegaMenuItem = ({ item }: { item: NavItemEntry }) => {
  const isCurrent = useIsCurrentNavItem(item)
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        hover="underline"
        className={cn('bg-transparent text-base', {
          'font-semibold': isCurrent,
        })}
      >
        {item.title}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="grid h-96 grid-cols-[300px_1fr] divide-x divide-gray-100">
          {/* Left: subcategory list — scrollable when > 4 items */}
          <ul className="flex h-full flex-col gap-1 overflow-y-auto overscroll-contain p-4">
            {item.subItems?.map((sub) => (
              <li key={sub.id}>
                <NavigationMenuLink asChild>
                  <Link
                    href={sub.link}
                    className="group flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-300"
                  >
                    <span className="text-sm font-sans md:text-xl text-gray-900 group-hover:text-black">
                      {sub.title}
                    </span>
                    {sub.description && (
                      <span className="font-sans text-xs md:text-lg leading-snug text-gray-400">
                        {sub.description}
                      </span>
                    )}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>

          {/* Right: latest articles */}
          <FlyoutArticles articles={item.featuredArticles ?? []} />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

// ── Latest articles panel ─────────────────────────────────────────────────────

const FlyoutArticles = ({ articles }: { articles: FlyoutArticle[] }) => {
  if (!articles.length) return null

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto overscroll-contain p-5">
      <p className="font-sans text-sm md:text-xl font-semibold tracking-widest text-gray-400">
        Latest articles
      </p>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 flex-1">
        {articles.map((article) => (
          <Link key={article.id} href={article.href} className="group flex flex-col gap-2">
            <div className="relative w-full flex-1 overflow-hidden rounded-xl bg-gray-100 transition-opacity group-hover:opacity-80">
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-100" />
              )}
            </div>
            <p className="font-sans text-sm md:text-lg font-medium leading-snug text-gray-800 group-hover:text-black">
              {article.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
