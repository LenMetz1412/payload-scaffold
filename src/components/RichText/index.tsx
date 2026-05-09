import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'
import { defaultLocale, type Locale } from '@/config/locales'
import { MediaBlock } from '@/payload/blocks/MediaBlock/Component'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utils/cn'

import { internalDocToHref } from './internalLink'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps>

const jsxConverters =
  (locale?: Locale): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (args) => internalDocToHref({ ...args, locale: locale ?? defaultLocale }),
    }),
    blocks: {
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-span-3 col-start-1"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
        />
      ),
    },
  })

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  locale?: Locale
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = false, locale, ...rest } = props
  const converter = jsxConverters(locale as Locale)
  return (
    <RichTextWithoutBlocks
      converters={converter}
      className={cn(
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'prose mx-auto break-words md:prose-md lg:prose-lg xl:prose-xl 2xl:prose-2xl':
            enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
