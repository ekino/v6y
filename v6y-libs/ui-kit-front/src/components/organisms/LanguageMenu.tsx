import * as React from 'react';

import { useTranslationProvider } from '../../translation/useTranslationProvider';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../molecules';

const languages = [
    { code: 'fr', label: 'Français', flagCode: 'fr' },
    { code: 'en', label: 'English', flagCode: 'gb' },
];

const Flag = ({ code, label }: { code: string; label: string }) => (
    <img
        src={`https://flagcdn.com/h20/${code}.png`}
        width={20}
        height={14}
        alt={label}
        loading="lazy"
        className="block rounded-[2px] object-cover"
        style={{ width: 20, height: 14 }}
    />
);

const LanguageMenu = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const currentLocale = getLocale();
    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    return (
        <Select value={currentLocale} onValueChange={changeLocale}>
            <SelectTrigger
                aria-label="Language selector"
                className="h-10 gap-1.5 rounded-md border border-gray-200 bg-transparent px-2.5 text-sm font-medium text-slate-700 shadow-none ring-0 transition-colors hover:bg-gray-50 focus:ring-0 data-[state=open]:bg-gray-50 [&>svg]:opacity-40"
            >
                <span className="ml-2 flex items-center gap-2">
                    <Flag code={currentLanguage.flagCode} label={currentLanguage.label} />
                    <span className="text-sm font-medium text-slate-700">
                        {currentLanguage.code.toUpperCase()}
                    </span>
                </span>
            </SelectTrigger>
            <SelectContent className="min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.code}
                        value={lang.code}
                        className="cursor-pointer rounded-md px-2 py-1.5 text-sm transition-colors focus:bg-gray-100 focus:text-slate-900"
                    >
                        <span className="pl-2 flex items-center gap-2">
                            <Flag code={lang.flagCode} label={lang.label} />
                            <span className="text-slate-700">{lang.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export { LanguageMenu };
