'use client';

import { useState } from 'react';

import { Button, Menu, X } from '@v6y/ui-kit-front';

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
            <header className="border-b border-gray-200 bg-white text-gray-950">
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
                            className="h-10 w-10 shrink-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950 md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-4 h-4" aria-hidden="true" />
                            ) : (
                                <Menu className="w-4 h-4" aria-hidden="true" />
                            )}
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
