import Image from 'next/image';
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

import { getSession } from '../../../infrastructure/providers/SessionProvider';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { useLogin, useLogout } from '../../hooks/useAuth';

const VitalityPageHeader = () => {
    const { translate } = useTranslationProvider();

    const { isLoggedIn } = useLogin();
    const { onLogout } = useLogout();

    const session = getSession();
    const userName = session?.username;

    return (
        <header className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href={VitalityNavigationPaths.DASHBOARD}>
                    <Image
                        width={150}
                        height={40}
                        loading="lazy"
                        src="/vitality_logo.svg"
                        alt="Vitality Logo"
                    />
                </Link>
            </div>
            <div className="flex items-center gap-2 text-center">
                <LanguageMenu />

                {isLoggedIn && (
                    <>
                        <Link className="text-black" href="/faq">
                            <Button className="border-gray-200" size="icon" variant="outline">
                                <QuestionMarkCircledIcon />
                            </Button>
                        </Link>
                        <TypographySmall>
                            {translate('vitality.header.welcome')} {userName}
                        </TypographySmall>

                        <Link href={VitalityNavigationPaths.LOGIN} onClick={onLogout}>
                            <Button size="icon" variant="outline">
                                <ExitIcon />
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default VitalityPageHeader;
