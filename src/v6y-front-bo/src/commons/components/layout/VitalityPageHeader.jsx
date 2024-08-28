'use client';

import { DownOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';
import {
    Layout as AntdLayout,
    Avatar,
    Button,
    Dropdown,
    Space,
    Switch,
    Typography,
    theme,
} from 'antd';
import Cookies from 'js-cookie';
import React, { useContext } from 'react';

import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import { ColorModeContext } from '../../../infrastructure/providers/ColorModeProvider.jsx';

export const VitalityPageHeader = () => {
    const { getLocale, changeLocale } = useTranslation();
    const currentLocale = getLocale();
    const { token } = theme.useToken();
    const { data: user } = useGetIdentity();
    const { mode, setMode } = useContext(ColorModeContext);

    const languageMenuItems = [...(['en', 'fr'] || [])].sort().map((lang) => ({
        key: lang,
        onClick: () => {
            changeLocale(lang);
            Cookies.set('NEXT_LOCALE', lang);
        },
        label: lang === 'en' ? 'English' : 'French',
        icon: (
            <span style={{ marginRight: 8 }}>
                <Avatar size={16} src={`/images/flags/${lang}.svg`} />
            </span>
        ),
    }));

    return (
        <AntdLayout.Header
            style={{
                backgroundColor: token.colorBgElevated,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '0px 24px',
                height: '64px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }}
        >
            <Dropdown
                menu={{
                    items: languageMenuItems,
                    selectedKeys: currentLocale ? [currentLocale] : [],
                }}
            >
                <Button type="text">
                    <Space>
                        <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
                        <Typography.Text>
                            {currentLocale === 'en' ? 'English' : 'French'}
                        </Typography.Text>
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
            <Space>
                <Switch
                    checkedChildren="🌛"
                    unCheckedChildren="🔆"
                    onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    defaultChecked={mode === 'dark'}
                />
                {(user?.name || user?.avatar) && (
                    <Space style={{ marginLeft: '8px' }} size="middle">
                        {user?.name && <Typography.Text strong>{user.name}</Typography.Text>}
                        {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
                    </Space>
                )}
            </Space>
        </AntdLayout.Header>
    );
};
