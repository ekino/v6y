'use client';

import { Menu } from 'antd';
import * as React from 'react';
import { useState } from 'react';

//TEMPORARY
const useLogin = () => [false];

import { buildVitalityHeaderMenuItems } from '@/commons/config/VitalityCommonConfig';


const VitalityPageHeaderMenu = () => {

    const [isLogged] = useLogin();
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (event: { key: string }) => {
        setCurrentSelectedMenu(event.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={buildVitalityHeaderMenuItems(isLogged)}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};



export default VitalityPageHeaderMenu;