import { ExitIcon, MagnifyingGlassIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@v6y/ui-kit-front/components/atoms/button';
import { TypographySmall } from '@v6y/ui-kit-front/components/molecules/Typography';
import { LanguageMenu } from '@v6y/ui-kit-front/components/organisms/LanguageMenu';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';

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
                <Link className="text-black" href="/faq">
                    <Button className="border-gray-200" size="icon" variant="outline">
                        <QuestionMarkCircledIcon />
                    </Button>
                </Link>

                {isLoggedIn && (
                    <Button size="icon" variant="outline">
                        <MagnifyingGlassIcon />
                    </Button>
                )}

                <LanguageMenu />

                {isLoggedIn && (
                    <>
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
