'use client';

import { VITALITY_HEADER_MENU_ITEMS } from '../../config/VitalityCommonConfig';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, useTranslationProvider } from '@v6y/ui-kit-front';
import Link from 'next/link';

const VitalityPageHeaderMenu = () => {
    const { translate } = useTranslationProvider();

    return (
        <NavigationMenu>
            {VITALITY_HEADER_MENU_ITEMS.map((item) => (
                <NavigationMenuItem key={item.key}>
                    <NavigationMenuLink asChild>
                        <Link href={item.link}>
                        {translate(item.translateLabel)}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
        </NavigationMenu>
    );
};

export default VitalityPageHeaderMenu;
