import type React from 'react'

import type { CreditBlock as CreditBlockProps } from '@/payload-types'
import { cn } from '@/utils/cn'

interface Props extends CreditBlockProps {
  frameCredits?: string
  frameSubCredits?: string
  eventCredits?: string
  eventSubCredits?: string
  type?: CreditBlockProps['type']
}

export const CreditBlock: React.FC<Props> = (props) => {
  const { frameCredits, frameSubCredits, eventCredits, eventSubCredits, type } = props
  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 gap-x-16 gap-y-0 lg:grid-cols-12">
        {frameCredits && type === 'concatenate' && (
          <>
            <div
              className={cn(`col-span-4 lg:col-span-8 lg:col-start-2`, {
                'md:col-span-2': 'full',
              })}
            >
              <div className="whitespace-pre-wrap">{frameCredits}</div>
              <div className="whitespace-pre-wrap">{frameSubCredits}</div>
            </div>
            <div
              className={cn(`col-span-4 lg:col-span-8 lg:col-start-3`, {
                'md:col-span-2': 'full',
              })}
            >
              {eventCredits && (
                <>
                  <div className="whitespace-pre-wrap">{eventCredits}</div>
                  <div className="whitespace-pre-wrap">{eventSubCredits}</div>
                </>
              )}
            </div>
          </>
        )}
        {type === 'inherit' && (
          <div
            className={cn(`col-span-4 lg:col-span-8 lg:col-start-2`, {
              'md:col-span-2': 'full',
            })}
          >
            <div className="ml-4 whitespace-pre-wrap">{frameCredits}</div>
            <div className="ml-16 whitespace-pre-wrap">{frameSubCredits}</div>
          </div>
        )}
        {type === 'overwrite' ||
          (!frameCredits && type === 'concatenate' && (
            <div
              className={cn(`col-span-4 lg:col-span-8 lg:col-start-2`, {
                'md:col-span-2': 'full',
              })}
            >
              <div className="ml-4 whitespace-pre-wrap">{eventCredits}</div>
              <div className="ml-16 whitespace-pre-wrap">{eventCredits}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
