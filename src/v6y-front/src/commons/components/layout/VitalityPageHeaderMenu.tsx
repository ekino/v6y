'use client';

import { Menu } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import { buildVitalityHeaderMenuItems } from '../../config/VitalityCommonConfig';
import { useLogin } from '../../hooks/useAuth';

const VitalityPageHeaderMenu = () => {
    const { isLoggedIn } = useLogin() as { isLoggedIn: boolean; isLoginLoading: boolean };
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (event: { key: string }) => {
        setCurrentSelectedMenu(event.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={buildVitalityHeaderMenuItems(isLoggedIn)}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};

export default VitalityPageHeaderMenu;
