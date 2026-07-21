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
            <header className="border-b border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] text-slate-950">
                <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-3 px-3 py-3 md:px-4 lg:px-6">
                    <div className="flex min-w-0 items-center gap-3 md:gap-4">
                        <HeaderLogo />
                    </div>

                    <div className="flex items-center gap-2">
                        <DesktopMenuItems
                            isLoggedIn={isLoggedIn}
                            userName={userName}
                            onLogout={onLogout}
                        />

                        <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 shrink-0 border-sky-200 bg-sky-50/70 text-slate-700 hover:bg-sky-100 hover:text-slate-950 md:hidden"
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
                    </div>
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
