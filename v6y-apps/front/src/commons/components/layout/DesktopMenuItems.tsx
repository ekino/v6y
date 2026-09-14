'use client';

import Link from 'next/link';

import {
    Button,
    ExitIcon,
    LanguageMenu,
    MagnifyingGlassIcon,
    QuestionMarkCircledIcon,
    Settings,
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
            <Link className="shrink-0" href="/faq">
                <Button
                    className="h-10 w-10 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                    size="icon"
                    variant="outline"
                >
                    <QuestionMarkCircledIcon className="w-5 h-5" />
                </Button>
            </Link>

            {isLoggedIn && (
                <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 shrink-0 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </Button>
            )}

            {isLoggedIn && (
                <Link
                    className="shrink-0"
                    href={VitalityNavigationPaths.NOTIFICATION_SETTINGS}
                    aria-label={translate('vitality.notificationSettingsPage.pageTitle')}
                >
                    <Button
                        className="h-10 w-10 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                        size="icon"
                        variant="outline"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </Link>
            )}

            <div className="shrink-0">
                <LanguageMenu />
            </div>

            {isLoggedIn && (
                <>
                    <div className="min-w-0 rounded-full border border-gray-200 bg-gray-100 px-3 py-2">
                        <TypographySmall className="truncate px-0 text-xs text-gray-600">
                            {translate('vitality.header.welcome')} {userName}
                        </TypographySmall>
                    </div>

                    <Link
                        href={VitalityNavigationPaths.LOGIN}
                        onClick={onLogout}
                        className="shrink-0"
                    >
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                        >
                            <ExitIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default DesktopMenuItems;
