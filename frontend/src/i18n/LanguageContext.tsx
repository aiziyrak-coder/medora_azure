
import React, { createContext, useState, ReactNode } from 'react';

export type Language = 'uz-L' | 'uz-C' | 'kaa' | 'ru' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default: Uzbek Latin (uz-L) — Cyrillic locale was corrupted; switch to uz-C when fixed
    const [language, setLanguage] = useState<Language>('uz-L');
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};