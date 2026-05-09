import { notFound } from 'next/navigation'
import type { FC } from 'react'

import type { CollectionSlugs } from '@/config/collections'
import { PageTemplate } from './collections/page'
import type { DocTemplateProps } from './common'

const components: Partial<Record<CollectionSlugs, FC<DocTemplateProps>>> = {
  pages: PageTemplate,
}

export const DocTemplate = (props: DocTemplateProps) => {
  const { collection } = props
  const Component = components[collection]

  if (!Component) {
    console.warn('MISSING COLLECTION TEMPLATE FOR', collection)
    return notFound()
  }

  return <Component {...props} />
}
