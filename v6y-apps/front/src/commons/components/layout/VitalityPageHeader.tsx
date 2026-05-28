'use client';

import { useState } from 'react';

import { Button } from '@v6y/ui-kit-front';

import { getSession } from '../../../infrastructure/providers/SessionProvider';
import { useLogin, useLogout } from '../../hooks/useAuth';
import DesktopMenuItems from './DesktopMenuItems';
import HeaderLogo from './HeaderLogo';
import MobileMenu from './MobileMenu';

const VitalityPageHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn } = useLogin();
    const { onLogout } = useLogout();

    const session = getSession();
    const userName = session?.username;

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-linear-to-r from-white/95 via-slate-50/85 to-white/95 shadow-[0_10px_26px_-24px_rgba(15,23,42,0.9)] backdrop-blur supports-backdrop-filter:bg-white/75">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 md:px-8 lg:px-12">
                    <div className="flex items-center gap-4 md:gap-8 shrink-0">
                        <HeaderLogo />
                    </div>

                    <DesktopMenuItems
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        onLogout={onLogout}
                    />

                    <Button
                        size="icon"
                        variant="outline"
                        className="md:hidden h-10 w-10 shrink-0 border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
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
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isLoggedIn={isLoggedIn}
                userName={userName}
                onLogout={onLogout}
            />
        </>
    );
};

export default VitalityPageHeader;
