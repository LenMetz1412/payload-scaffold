'use client'

import { CollapsableWrapper } from '@/components/collapsible-content'

interface ContentGridLayoutProps {
  children?: React.ReactNode
  collapsible?: boolean | null | undefined
}

export const ContentGridLayout: React.FC<ContentGridLayoutProps & { children?: React.ReactNode }> = (props) => {
  const { children, collapsible } = props

  return (
    <CollapsableWrapper isCollapsible={!!collapsible}>
      <div className="grid-rows-auto relative grid grid-flow-row grid-cols-1 content-start items-start justify-start gap-x-8 gap-y-0 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12">
        {children}
      </div>
    </CollapsableWrapper>
  )
}
