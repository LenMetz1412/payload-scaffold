import { Loader } from 'lucide-react'

import { cn } from '@/utils/cn'

export const Loading = ({
  customText,
  customStyle,
}: {
  customText?: string
  customStyle?: string
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12">
      <Loader className="animate-spin text-slate-600" size={48} />
      <p
        className={cn('mt-4 text-slate-600', customStyle)}
        dangerouslySetInnerHTML={{ __html: customText ?? '...' }}
      />
    </div>
  )
}
