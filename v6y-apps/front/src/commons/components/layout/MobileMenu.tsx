'use client';

import Link from 'next/link';

import {
    Button,
    ExitIcon,
    LanguageMenu,
    MagnifyingGlassIcon,
    QuestionMarkCircledIcon,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import HeaderLogo from './HeaderLogo';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    userName?: string;
    onLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, isLoggedIn, userName, onLogout }: MobileMenuProps) => {
    const { translate } = useTranslationProvider();

    if (!isOpen) return null;

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={onClose}>
            <div
                className="absolute inset-0 bg-white flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex items-center justify-between px-4 py-2 md:py-4 flex-shrink-0">
                    <HeaderLogo onClick={onClose} />
                    <Button
                        size="icon"
                        variant="outline"
                        className="border-gray-200 h-9 w-9"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </Button>
                </div>

                <nav className="flex-1 overflow-y-auto space-y-2">
                    <Link href="/faq" onClick={onClose}>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-colors">
                            <QuestionMarkCircledIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-base font-medium">FAQ</span>
                        </button>
                    </Link>

                    {isLoggedIn && (
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 flex items-center gap-3 transition-colors">
                            <MagnifyingGlassIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-base font-medium">Search</span>
                        </button>
                    )}

                    {isLoggedIn && (
                        <div className="px-4 py-4 border-y border-slate-200 my-4">
                            <p className="text-xs text-slate-500 mb-1">
                                {translate('vitality.header.welcome')}
                            </p>
                            <p className="font-semibold text-base text-slate-900">{userName}</p>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="border-t border-slate-200 p-4 space-y-3 flex-shrink-0 bg-white">
                    <div className="w-full">
                        <p className="text-xs text-slate-500 mb-2">Language</p>
                        <LanguageMenu />
                    </div>

                    {isLoggedIn && (
                        <Link
                            href={VitalityNavigationPaths.LOGIN}
                            onClick={handleLogout}
                            className="block w-full"
                        >
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 gap-2 h-10"
                                onClick={handleLogout}
                            >
                                <ExitIcon className="w-4 h-4" />
                                <span>Logout</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
