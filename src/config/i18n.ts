// config/i18n.ts
export const defaultLocale = 'fr' as const
export const locales = ['fr', 'en', 'jp', 'ar'] as const

export type Locale = (typeof locales)[number]

// Dictionnaires de traduction
export const dictionaries = {
    fr: () => import('../../public/locales/dictionaries/fr.json').then((module) => module.default),
    en: () => import('../../public/locales/dictionaries/en.json').then((module) => module.default),
    jp: () => import('../../public/locales/dictionaries/jp.json').then((module) => module.default),
    ar: () => import('../../public/locales/dictionaries/ar.json').then((module) => module.default),

}

export const getDictionary = async (locale: Locale) => {
    return dictionaries[locale]?.() ?? dictionaries.fr()
}