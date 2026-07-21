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
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm" onClick={onClose}>
            <div
                className="absolute inset-x-0 top-0 flex max-h-[100svh] flex-col overflow-hidden border-b border-slate-200 bg-white text-slate-900 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full items-center justify-between px-4 py-3 shrink-0">
                    <HeaderLogo onClick={onClose} />
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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

                <nav className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
                    <Link href="/faq" onClick={onClose}>
                        <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100">
                            <QuestionMarkCircledIcon className="w-5 h-5 shrink-0" />
                            <span className="text-base font-medium">FAQ</span>
                        </button>
                    </Link>

                    {isLoggedIn && (
                        <button className="mt-3 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100">
                            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
                            <span className="text-base font-medium">Search</span>
                        </button>
                    )}

                    {isLoggedIn && (
                        <div className="my-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p className="mb-1 text-xs text-slate-500">
                                {translate('vitality.header.welcome')}
                            </p>
                            <p className="text-base font-semibold text-slate-950">{userName}</p>
                        </div>
                    )}
                </nav>

                <div className="border-t border-slate-200 bg-white p-4 space-y-3 shrink-0">
                    <div className="w-full">
                        <p className="mb-2 text-xs text-slate-500">Language</p>
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
                                className="h-10 w-full gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
