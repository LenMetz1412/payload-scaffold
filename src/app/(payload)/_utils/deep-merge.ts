/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return !!(item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export default function deepMerge<
  T extends Record<string, unknown>,
  R extends Record<string, unknown>,
>(target: T, source: R): T & R {
  const output = { ...target } as T & R

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key]

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          ;(output as Record<string, unknown>)[key] = sourceValue
        } else {
          const targetValue = target[key]

          if (isObject(targetValue)) {
            ;(output as Record<string, unknown>)[key] = deepMerge(targetValue, sourceValue)
          } else {
            ;(output as Record<string, unknown>)[key] = sourceValue
          }
        }
      } else {
        ;(output as Record<string, unknown>)[key] = sourceValue
      }
    })
  }

  return output
}
