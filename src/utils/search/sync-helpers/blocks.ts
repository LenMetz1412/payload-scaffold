import type { ContentBlock, FaqBlock } from '@/payload-types'

import { extractRichTextField } from './lexical'

export type GenericLayoutBlock =
  | ContentBlock
  | FaqBlock
  | { blockType: string; [key: string]: unknown }

export function extractContentBlocks(layout: GenericLayoutBlock[] | undefined): {
  blockIndex: number
  cols: { colIndex: number; text: string }[]
}[] {
  if (!Array.isArray(layout)) return []

  const result: {
    blockIndex: number
    cols: { colIndex: number; text: string }[]
  }[] = []

  layout.forEach((block, blockIndex) => {
    if (block.blockType === 'content' && 'columns' in block && Array.isArray(block.columns)) {
      const contentBlock = block as ContentBlock
      const cols =
        contentBlock.columns?.map((col, colIndex) => ({
          colIndex,
          text: extractRichTextField(col.richText),
        })) || []

      result.push({ blockIndex, cols })
    }
  })

  return result
}

export function extractFAQsFromBlock(layout: GenericLayoutBlock[] | undefined): {
  question: string
  answer: string
}[] {
  if (!Array.isArray(layout)) return []

  return layout
    .filter((block): block is FaqBlock => block.blockType === 'faqBlock' && 'faqs' in block)
    .flatMap(
      (block) =>
        block.faqs?.map((faq) => ({
          question: faq.question,
          answer: extractRichTextField(faq.answer),
        })) || [],
    )
}
