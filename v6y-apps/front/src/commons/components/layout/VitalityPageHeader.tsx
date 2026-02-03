'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
    Button,
    ExitIcon,
    LanguageMenu,
    MagnifyingGlassIcon,
    QuestionMarkCircledIcon,
    TypographySmall,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import { getSession } from '../../../infrastructure/providers/SessionProvider';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { useLogin, useLogout } from '../../hooks/useAuth';

const VitalityPageHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { translate } = useTranslationProvider();

    const { isLoggedIn } = useLogin();
    const { onLogout } = useLogout();

    const session = getSession();
    const userName = session?.username;

    const handleLogout = () => {
        onLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="py-2 md:py-4 px-4 md:px-0 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                    <Link href={VitalityNavigationPaths.DASHBOARD} className="flex-shrink-0">
                        <div className="md:hidden flex items-center justify-center h-10 w-10">
                            <Image
                                width={40}
                                height={40}
                                loading="lazy"
                                src="/favicon.svg"
                                alt="Vitality Logo"
                                className="w-full h-full"
                            />
                        </div>

                        <div className="hidden md:block">
                            <Image
                                width={150}
                                height={40}
                                src="/vitality_logo.svg"
                                alt="Vitality Logo"
                                priority
                            />
                        </div>
                    </Link>
                </div>

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
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="border-gray-200 h-10 w-10"
                                >
                                    <ExitIcon className="w-5 h-5" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <Button
                    size="icon"
                    variant="outline"
                    className="md:hidden border-gray-200 h-9 w-9 flex-shrink-0"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </Button>
            </header>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="fixed inset-0 bg-white flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <Link
                                href={VitalityNavigationPaths.DASHBOARD}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Image
                                    width={40}
                                    height={40}
                                    loading="lazy"
                                    src="/favicon.svg"
                                    alt="Vitality Logo"
                                />
                            </Link>
                            <Button
                                size="icon"
                                variant="outline"
                                className="border-gray-200 h-9 w-9"
                                onClick={() => setIsMobileMenuOpen(false)}
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

                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>
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
                                    <p className="font-semibold text-base text-slate-900">
                                        {userName}
                                    </p>
                                </div>
                            )}
                        </nav>

                        <div className="border-t border-slate-200 p-4 space-y-3">
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
            )}
        </>
    );
};

export default VitalityPageHeader;
