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
            <header className="py-2 md:py-4 md:px-0 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                    <HeaderLogo />
                </div>

                <DesktopMenuItems isLoggedIn={isLoggedIn} userName={userName} onLogout={onLogout} />

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
