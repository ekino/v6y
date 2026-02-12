'use client';

import Link from 'next/link';

import {
    Button,
    ExitIcon,
    LanguageMenu,
    MagnifyingGlassIcon,
    QuestionMarkCircledIcon,
    TypographySmall,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';

interface DesktopMenuItemsProps {
    isLoggedIn: boolean;
    userName?: string;
    onLogout: () => void;
}

const DesktopMenuItems = ({ isLoggedIn, userName, onLogout }: DesktopMenuItemsProps) => {
    const { translate } = useTranslationProvider();

    return (
        <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
            <Link className="text-black flex-shrink-0" href="/faq">
                <Button className="border-gray-200 h-10 w-10" size="icon" variant="outline">
                    <QuestionMarkCircledIcon className="w-5 h-5" />
                </Button>
            </Link>

            {isLoggedIn && (
                <Button
                    size="icon"
                    variant="outline"
                    className="border-gray-200 h-10 w-10 flex-shrink-0"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </Button>
            )}

            <div className="flex-shrink-0">
                <LanguageMenu />
            </div>

            {isLoggedIn && (
                <>
                    <div className="min-w-0">
                        <TypographySmall className="text-xs md:text-sm text-center text-slate-700 truncate px-2">
                            {translate('vitality.header.welcome')} {userName}
                        </TypographySmall>
                    </div>

                    <Link
                        href={VitalityNavigationPaths.LOGIN}
                        onClick={onLogout}
                        className="flex-shrink-0"
                    >
                        <Button size="icon" variant="outline" className="border-gray-200 h-10 w-10">
                            <ExitIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default DesktopMenuItems;
