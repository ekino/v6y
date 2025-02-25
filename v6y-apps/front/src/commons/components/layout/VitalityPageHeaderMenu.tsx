'use client';

import { Menu } from '@v6y/shared-ui';
import * as React from 'react';
import { useState } from 'react';

import { buildVitalityHeaderMenuItems } from '../../config/VitalityCommonConfig';
import { useLogin, useLogout } from '../../hooks/useAuth';

const VitalityPageHeaderMenu = () => {
    const { isLoggedIn } = useLogin();
    const { onLogout } = useLogout();
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (event: { key: string }) => {
        setCurrentSelectedMenu(event.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={buildVitalityHeaderMenuItems(isLoggedIn, onLogout)}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};

export default VitalityPageHeaderMenu;
