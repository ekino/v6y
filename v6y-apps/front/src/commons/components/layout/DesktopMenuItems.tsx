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
    const iconButtonClassName =
        'h-10 w-10 border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-100';

    return (
        <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
            <Link className="shrink-0" href="/faq">
                <Button className={iconButtonClassName} size="icon" variant="outline">
                    <QuestionMarkCircledIcon className="w-5 h-5" />
                </Button>
            </Link>

            {isLoggedIn && (
                <Button size="icon" variant="outline" className={`${iconButtonClassName} shrink-0`}>
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </Button>
            )}

            <div className="shrink-0">
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
                        className="shrink-0"
                    >
                        <Button size="icon" variant="outline" className={iconButtonClassName}>
                            <ExitIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default DesktopMenuItems;
