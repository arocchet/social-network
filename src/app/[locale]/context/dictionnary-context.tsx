'use client';
import { Locale } from '@/config/i18n';
import { createContext, useContext, ReactNode } from 'react';

type DictionaryContextType = {
    dict: any;
    locale: Locale;
};

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
    children,
    dict,
    locale
}: {
    children: ReactNode;
    dict: any;
    locale: Locale;
}) {
    return (
        <DictionaryContext.Provider value={{ dict, locale }}>
            {children}
        </DictionaryContext.Provider>
    );
}

export function useClientDictionary() {
    const context = useContext(DictionaryContext);
    if (!context) {
        throw new Error('useClientDictionary must be used within DictionaryProvider');
    }
    return context;
}