'use client';

import { Menu } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import { BuildVitalityHeaderMenuItems } from '../../config/VitalityCommonConfig';
import { useLogin } from '../../hooks/useAuth';

const VitalityPageHeaderMenu = () => {
    const { isLoggedIn } = useLogin();
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (event: { key: string }) => {
        setCurrentSelectedMenu(event.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={BuildVitalityHeaderMenuItems(isLoggedIn)}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};

export default VitalityPageHeaderMenu;
