'use client';

import { DownOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';
import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText/VitalityText';
import { Layout as AntdLayout, Avatar, Button, Dropdown, Space, Switch, theme } from 'antd';
import Cookie from 'js-cookie';
import * as React from 'react';
import { useContext } from 'react';

import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import { ColorModeContext } from '../../../infrastructure/providers/ColorModeProvider';

interface ColorModeContextType {
    setMode: (mode: string) => void;
    mode: string;
}

interface UserType {
    data: {
        name?: string;
        avatar?: string;
    };
}

export const VitalityPageHeader = () => {
    const { getLocale, changeLocale } = useTranslation();
    const currentLocale = getLocale();
    const { token } = theme.useToken();
    const { data: user } = useGetIdentity() as UserType;
    const { mode, setMode } = useContext(ColorModeContext) as ColorModeContextType;

    const languageMenuItems = ['en', 'fr'].sort().map((lang) => ({
        key: lang,
        onClick: () => {
            changeLocale(lang);
            Cookie.set('NEXT_LOCALE', lang);
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
                        <VitalityText text={currentLocale === 'en' ? 'English' : 'French'} />
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
            <Space>
                <Switch
                    checkedChildren="🌛"
                    unCheckedChildren="🔆"
                    onChange={() => {
                        const newMode: string = mode === 'dark' ? 'light' : 'dark';
                        setMode(newMode);
                    }}
                    defaultChecked={mode === 'dark'}
                />
                {(user?.name || user?.avatar) && (
                    <Space style={{ marginLeft: '8px' }} size="middle">
                        {user?.name && <VitalityText strong text={user.name} />}
                        {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
                    </Space>
                )}
            </Space>
        </AntdLayout.Header>
    );
};
