'use client';

import { LanguageMenu, Menu, Space } from '@v6y/ui-kit';
import * as React from 'react';
import { useState } from 'react';

import { VITALITY_HEADER_MENU_ITEMS } from '../../config/VitalityCommonConfig';
import { useLogin, useLogout } from '../../hooks/useAuth';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, useTranslationProvider } from '@v6y/ui-kit-front';
import Link from 'next/link';

const VitalityPageHeaderMenu = () => {
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (event: { key: string }) => {
        setCurrentSelectedMenu(event.key);
    };

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
