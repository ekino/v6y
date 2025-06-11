import * as React from 'react';

import { useTranslationProvider } from '../../translation/useTranslationProvider';
import { Avatar, AvatarImage, Select, SelectContent, SelectItem, SelectTrigger } from '../atoms';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
];

const LanguageMenu = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const currentLocale = getLocale();
    const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

    return (
        <Select value={currentLocale} onValueChange={changeLocale}>
            <SelectTrigger size="sm" aria-label="Language selector">
                <Avatar className="size-4">
                    <AvatarImage src={`/images/flags/${currentLang.code}.svg`} alt={currentLang.label} />
                </Avatar>
                <span className="mx-2">{currentLang.label}</span>
            </SelectTrigger>
            <SelectContent align="end">
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.code}
                        value={lang.code}
                        disabled={lang.code === currentLocale}
                        className="flex flex-row items-center"
                    >
                        <Avatar className="size-4">
                            <AvatarImage src={`/images/flags/${lang.code}.svg`} alt={lang.label} />
                        </Avatar>
                        <span className="ml-2">{lang.label}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export { LanguageMenu };
