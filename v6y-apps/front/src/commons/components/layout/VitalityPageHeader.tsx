import {
    Button,
    ExitIcon,
    LanguageMenu,
    MagnifyingGlassIcon,
    QuestionMarkCircledIcon,
    TypographyLead,
    TypographySmall,
    useTranslationProvider,
} from '@v6y/ui-kit-front';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { getSession } from '../../../infrastructure/providers/SessionProvider';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { useLogin, useLogout } from '../../hooks/useAuth';
import VitalityPageHeaderMenu from './VitalityPageHeaderMenu';

const VitalityPageHeader = () => {
    const { translate } = useTranslationProvider();

    const { isLoggedIn } = useLogin();
    const { onLogout } = useLogout();

    const session = getSession();
    const userName = session?.username;

    return (
        // <Row>
        //     <Col xs={0} sm={0} md={4} lg={4} xl={4}>
        //         <Link href={VitalityNavigationPaths.DASHBOARD}>
        //             <Image
        //                 width={150}
        //                 height={40}
        //                 loading="lazy"
        //                 src="/vitality_logo.svg"
        //                 alt="Vitality Logo"
        //             />
        //         </Link>
        //     </Col>
        //     <Col xs={16} sm={16} md={16} lg={16} xl={16}>
        //         <TitleView title={title} subTitle={subTitle} />
        //     </Col>
        //     <Col xs={8} sm={8} md={4} lg={4} xl={4}>
        //         <VitalityPageHeaderMenu />
        //     </Col>
        // </Row>
        <header className="h-[60px] px-16 py-3 flex items-center justify-between">
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
                
                    {isLoggedIn && (
                        <VitalityPageHeaderMenu />
                    )}
            </div>
            <div className="flex items-center gap-4 text-center">
                <Button size="icon" variant="outline">
                    <QuestionMarkCircledIcon />
                </Button>

                {isLoggedIn && (
                    <>
                        <Button size="icon" variant="outline">
                            <MagnifyingGlassIcon />
                        </Button>
                        <LanguageMenu />
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
