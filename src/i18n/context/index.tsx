'use client'

import { createContext, type PropsWithChildren, useContext } from 'react'

import type { Dictionary } from '..'

const DictionaryContext = createContext<Dictionary | undefined>(undefined)

/**
 * Provides the dictionary to all child components via context.
 * 
 * in server component  Fetch the dictionary based on the locale
 * ....
 * const t = await getDictionary(locale) Or eg { welcome: 'Welcome', goodbye: 'Goodbye' };

 * <DictionaryProvider t={{ welcome: 'Welcome', goodbye: 'Goodbye' }}>
 *   <App />
 * </DictionaryProvider>
 * ....
 * 
 * eg client component
 * const SomeComponent = () => {
 *    const t = useDictionary();
 *    return <div>{t['welcome']}</div>;
 * };
 *
 */

export const DictionaryProvider = ({
  dictionary,
  children,
}: {
  dictionary: Dictionary
} & PropsWithChildren) => {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }
  return context
}
