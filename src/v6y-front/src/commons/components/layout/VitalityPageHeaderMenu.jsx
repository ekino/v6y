'use client';

import React, { useState } from 'react';
import { Menu, Typography } from 'antd';
import Link from 'next/link';

const VITALITY_HEADER_MENU_ITEMS = [
    {
        key: 'notification',
        label: (
            <Link href="/notifications">
                <Typography.Text>Notifications</Typography.Text>
            </Link>
        ),
    },
    {
        key: 'FAQ',
        label: (
            <Link href="/faq">
                <Typography.Text>FAQ</Typography.Text>
            </Link>
        ),
    },
];

const VitalityPageHeaderMenu = () => {
    const [currentSelectedMenu, setCurrentSelectedMenu] = useState('mail');

    const onMenuClicked = (e) => {
        setCurrentSelectedMenu(e.key);
    };

    return (
        <Menu
            mode="horizontal"
            items={VITALITY_HEADER_MENU_ITEMS}
            onClick={onMenuClicked}
            selectedKeys={[currentSelectedMenu]}
        />
    );
};

export default VitalityPageHeaderMenu;
