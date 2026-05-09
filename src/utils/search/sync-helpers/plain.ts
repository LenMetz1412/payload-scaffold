type Titleable = { title?: string }
type TitleField = string | Titleable | (string | Titleable)[] | undefined | null

export function extractTitles(field: TitleField): string {
  if (!field) return ''

  if (Array.isArray(field)) {
    return field
      .map((item) => (typeof item === 'object' && item.title ? item.title : ''))
      .filter(Boolean)
      .join(', ')
  }

  if (typeof field === 'object') {
    return field.title ?? ''
  }

  return String(field)
}
