const extractTextFromNode = (node: any): string => {
  if (!node || typeof node !== 'object') {
    return ''
  }

  // Extract text from text nodes
  if (node.type === 'text' && node.text) {
    return node.text
  }

  // Recursively extract text from child nodes
  if (Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim()
  }

  // Fallback for other node types
  return ''
}

export const extractPlainText = (content: any): string => {
  if (!content) return ''

  // If it's already a plain string
  if (typeof content === 'string') {
    return content.trim()
  }

  // Handle Lexical format
  if (typeof content === 'object' && content.root && Array.isArray(content.root.children)) {
    return content.root.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return ''
}
