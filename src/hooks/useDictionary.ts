import { getDictionary, type Locale } from '@/config/i18n';
import { cache } from 'react';

// Cache pour éviter les appels multiples
export const getCachedDictionary = cache(async (locale: Locale) => {
    return getDictionary(locale);
});

// Hook pour les Server Components
export async function useDictionary(locale: Locale) {
    return await getCachedDictionary(locale);
}