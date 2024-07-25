'use client';

import React, { useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';

const VITALITY_MENU_ITEMS = [
    {
        key: 'notification',
        label: <Link href="/notifications">Notifications</Link>,
    },
    {
        key: 'FAQ',
        label: <Link href="/faq">FAQ</Link>,
    },
];

const VitalityMenuItems = () => {
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (e) => {
        setCurrentSelectedMenu(e.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={VITALITY_MENU_ITEMS}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};

export default VitalityMenuItems;
