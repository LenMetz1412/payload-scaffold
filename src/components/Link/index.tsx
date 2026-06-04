import type { CollectionSlugs } from '@/config/collections'
import { defaultLocale, type Locale } from '@/config/locales'
import type { ButtonProps } from '@/sha/button'
import { Button } from '@/sha/button'
import type { BaseDocument } from '@/utils/base-document'
import { cn } from '@/utils/cn'
import { getLocalizedPath } from '@/utils/i18n/path'
import { getPopulatedRelation, sanitizeString } from '@/utils/sanitize'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'

type LinkReference = {
  relationTo: string
  value: BaseDocument | string | number | null
}

export type CMSLinkType = 'custom' | 'reference' | null

export type CMSLinkProps = {
  appearance?: 'inline' | 'outline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: LinkReference | null
  size?: ButtonProps['size'] | null
  type?: CMSLinkType
  url?: string | null
  layout?: 'default' | 'heading'
  locale?: Locale
}

export const CMSLink: React.FC<CMSLinkProps> = ({
  type,
  appearance = 'outline',
  children,
  className,
  label,
  newTab,
  reference,
  size: sizeFromProps,
  url,
  layout = 'default',
  locale = defaultLocale,
}) => {
  const href = getHref(type, reference ?? null, url ?? null, locale)
  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const size = appearance === 'link' ? 'clear' : sizeFromProps

  const linkContent = (
    <>
      <ArrowRight />
      {label}
      {children}
    </>
  )

  if (typeof href === 'string' && (href.startsWith('http://') || href.startsWith('https://'))) {
    if (appearance === 'inline') {
      return (
        <a href={href} className={cn(className, 'font-sans')} {...newTabProps}>
          {label}
          {children}
        </a>
      )
    }

    return (
      <Button asChild className={cn(className, 'mt-4')} size={size} variant={appearance}>
        <a href={href} className="inline-flex items-center gap-2" {...newTabProps}>
          {linkContent}
        </a>
      </Button>
    )
  }

  if (appearance === 'inline') {
    return (
      <Link href={href} className={cn(className, 'font-sans')} {...newTabProps}>
        {label}
        {children}
      </Link>
    )
  }

  return layout === 'heading' ? (
    <Button
      asChild
      className={cn(className, 'mt-4 border-none px-1 shadow-none')}
      size={size}
      variant={appearance}
    >
      <Link href={href} {...newTabProps} className="group">
        <div className="h2 inline-flex items-center gap-2">
          {label}
          {children}
          <ArrowRight size={48} />
        </div>
      </Link>
    </Button>
  ) : (
    <Button asChild className={cn(className, 'mt-4')} size={size} variant={appearance}>
      <Link href={href} {...newTabProps} className="inline-flex items-center gap-2">
        {linkContent}
      </Link>
    </Button>
  )
}

function getHref(
  type: CMSLinkProps['type'],
  reference: LinkReference | null,
  url: string | null,
  locale: Locale,
): string | null {
  if (type === 'reference' && reference?.relationTo && reference.value) {
    const doc = getPopulatedRelation(reference.value)
    if (!doc) return null
    const { path } = getLocalizedPath({
      locale,
      collection: reference.relationTo as CollectionSlugs,
      doc: doc,
    })
    return path
  }

  if (type === 'custom' && sanitizeString(url)) {
    return url
  }

  return null
}
