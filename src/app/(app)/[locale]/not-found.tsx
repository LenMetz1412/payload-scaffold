'use client'

import { useDictionary } from '@/i18n/context'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  const t = useDictionary()
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-[#d9d9d9] px-8 lg:px-16">
      <div className="flex w-full max-w-4xl flex-col gap-8 md:flex-row md:items-start md:gap-16">
        <Link
          href="/"
          className="flex w-60 items-start gap-2 font-sans text-xs tracking-widest text-gray-700 uppercase"
        >
          <MoveLeft size={14} />
          <span className="underline">{t.notFound.backToHome}</span>
        </Link>

        <div className="flex flex-col">
          <div className="mb-4 flex">
            <div className="h-6 w-6 bg-[#BDB797] lg:h-8 lg:w-8" />
            <div className="-mt-3 h-6 w-10 bg-[#CFC699] lg:h-8 lg:w-8" />
            <div className="h-6 w-10 bg-[#F5EDBF] lg:h-8 lg:w-12" />
          </div>

          <h1 className="font-sans text-4xl leading-tight text-gray-700 lg:text-6xl xl:text-7xl">
            {t.notFound.message}
          </h1>
        </div>
      </div>
    </div>
  )
}
