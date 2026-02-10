import * as React from 'react';

import useTranslationProvider from '../../translation/useTranslationProvider';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../molecules/Select';

const languages = [
    { code: 'fr', label: 'Français', flagCode: 'fr' },
    { code: 'en', label: 'English', flagCode: 'gb' },
];

const LanguageMenu = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const currentLocale = getLocale();
    const currentLanguage = languages.find((lang) => lang.code === currentLocale);

    return (
        <Select value={currentLocale} onValueChange={changeLocale}>
            <SelectTrigger className="border-gray-200" aria-label="Language selector">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                        src={`https://flagcdn.com/h20/${currentLanguage?.flagCode}.png`}
                        width={20}
                        height={16}
                        alt={currentLanguage?.label}
                        loading="lazy"
                    />
                    {currentLanguage?.label}
                </span>
            </SelectTrigger>
            <SelectContent>
                {languages
                    .filter((lang) => lang.code !== currentLocale)
                    .map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <img
                                    src={`https://flagcdn.com/h20/${lang.flagCode}.png`}
                                    width={20}
                                    height={16}
                                    alt={lang.label}
                                    loading="lazy"
                                />
                                {lang.label}
                            </span>
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    );
};

export { LanguageMenu };
