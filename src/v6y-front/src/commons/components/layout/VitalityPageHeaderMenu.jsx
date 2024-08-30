'use client';

import { NotificationOutlined, QuestionOutlined } from '@ant-design/icons';
import { Menu, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths.js';


const VITALITY_HEADER_MENU_ITEMS = [
    {
        key: 'notification',
        icon: <NotificationOutlined />,
        label: (
            <Link href={VitalityNavigationPaths.NOTIFICATIONS} style={{ textDecoration: 'none' }}>
                <Typography.Text>Notifications</Typography.Text>
            </Link>
        ),
    },
    {
        key: 'FAQ',
        icon: <QuestionOutlined />,
        label: (
            <Link href={VitalityNavigationPaths.FAQ} style={{ textDecoration: 'none' }}>
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
