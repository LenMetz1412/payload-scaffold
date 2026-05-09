import { defaultLocale } from '@/config/locales' // Adjust the import based on your project structure
import { validateLocaleWithFallback } from '@/utils/qs' // Adjust the import based on your project structure

export const getUserLocale = () => {
  // On the server, you can get the locale from headers or use a default
  if (typeof window === 'undefined') {
    // You might want to check headers for locale in a real scenario
    return defaultLocale // Fallback to default locale on server
  }

  // On the client, get the navigator language
  const locale = navigator.language.split('-')[0]

  return validateLocaleWithFallback(locale)
}
