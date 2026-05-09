export const translateWith = (
  template: string,
  vars: Record<string, string | number | undefined | null>,
) => {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(`{{${key}}}`, value == null ? '' : String(value)),
    template,
  )
}
