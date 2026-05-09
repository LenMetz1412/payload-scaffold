import { ChevronDown } from 'lucide-react'

export function ChevronIndicator() {
  return (
    <span className="ml-2 flex size-6 shrink-0 desktop:size-4">
      <ChevronDown
        size="100%"
        className="top-[1px] transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </span>
  )
}
