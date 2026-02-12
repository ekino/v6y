'use client';

import Image from 'next/image';
import Link from 'next/link';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';

interface HeaderLogoProps {
    onClick?: () => void;
}

const HeaderLogo = ({ onClick }: HeaderLogoProps) => {
    return (
        <Link href={VitalityNavigationPaths.DASHBOARD} className="flex-shrink-0" onClick={onClick}>
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
    );
};

export default HeaderLogo;
