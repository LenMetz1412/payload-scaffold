type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
}

type LexicalElementNode = {
  type: string
  children?: LexicalNode[]
}

type LexicalNode = LexicalTextNode | LexicalElementNode

type LexicalRoot = {
  children?: LexicalNode[]
}

export type LexicalField = {
  root?: LexicalRoot
}

export type RichTextField = {
  richText?: LexicalField
}

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return 'text' in node && typeof node.text === 'string'
}

function extractRichTextNode(node: LexicalNode): string {
  if (isTextNode(node)) return node.text || ''

  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractRichTextNode).join(' ')
  }

  return ''
}

export function extractRichTextField(field: LexicalField | undefined | null): string {
  if (!field?.root?.children) return ''
  return field.root.children.map(extractRichTextNode).join(' ')
}
