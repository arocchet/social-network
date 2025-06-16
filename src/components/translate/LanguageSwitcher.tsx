// components/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/config/i18n';
import { useState, useTransition } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
    currentLocale: Locale;
    variant?: 'buttons' | 'dropdown' | 'select' | 'flags';
    className?: string;
}

// Données des langues avec labels et drapeaux
const languageData: Record<Locale, { label: string; flag: string; nativeName: string }> = {
    fr: { label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    en: { label: 'English', flag: '🇺🇸', nativeName: 'English' },
    jp: { label: 'Japan', flag: '🇯🇵', nativeName: 'Japan' },
    ar: { label: 'Arabic', flag: '🇸🇦', nativeName: 'Arabic' },
};

export default function LanguageSwitcher({
    currentLocale,
    variant = 'dropdown',
    className = ''
}: LanguageSwitcherProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLanguageChange = (newLocale: Locale) => {
        if (newLocale === currentLocale) return;

        startTransition(() => {
            // Remplacer la locale actuelle dans le pathname
            const segments = pathname.split('/');
            segments[1] = newLocale;
            const newPath = segments.join('/');

            // Sauvegarder la préférence dans un cookie
            document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

            router.push(newPath);
            setIsOpen(false);
        });
    };

    // Variante 1: Boutons simples
    if (variant === 'buttons') {
        return (
            <div className={`flex gap-1 ${className}`}>
                {locales.map((locale) => (
                    <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        disabled={isPending}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${locale === currentLocale
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {languageData[locale].flag} {locale.toUpperCase()}
                    </button>
                ))}
            </div>
        );
    }

    // Variante 2: Select simple
    if (variant === 'select') {
        return (
            <select
                value={currentLocale}
                onChange={(e) => handleLanguageChange(e.target.value as Locale)}
                disabled={isPending}
                className={`px-3 py-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className} ${isPending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {locales.map((locale) => (
                    <option key={locale} value={locale}>
                        {languageData[locale].flag} {languageData[locale].nativeName}
                    </option>
                ))}
            </select>
        );
    }

    // Variante 3: Drapeaux uniquement
    if (variant === 'flags') {
        return (
            <div className={`flex gap-2 ${className}`}>
                {locales.map((locale) => (
                    <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        disabled={isPending}
                        title={languageData[locale].nativeName}
                        className={`w-8 h-8 text-lg rounded-full transition-all duration-200 hover:scale-110 ${locale === currentLocale
                            ? 'ring-2 ring-blue-500 ring-offset-2'
                            : 'hover:ring-1 hover:ring-gray-300'
                            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {languageData[locale].flag}
                    </button>
                ))}
            </div>
        );
    }

    // Variante 4: Dropdown (défaut)
    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {languageData[currentLocale].flag} {languageData[currentLocale].nativeName}
                </span>
                <span className="sm:hidden">
                    {languageData[currentLocale].flag}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop pour fermer le dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                        <div className="py-1">
                            {locales.map((locale) => (
                                <button
                                    key={locale}
                                    onClick={() => handleLanguageChange(locale)}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${locale === currentLocale ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-lg">{languageData[locale].flag}</span>
                                        <span>{languageData[locale].nativeName}</span>
                                    </span>
                                    {locale === currentLocale && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Hook pour obtenir la locale actuelle dans les Client Components
export function useCurrentLocale(): Locale {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] as Locale;
    return locales.includes(locale) ? locale : 'fr';
}