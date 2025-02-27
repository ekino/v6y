import * as React from 'react';

import { useTranslationProvider } from '../../../translation/useTranslationProvider';
import { Avatar, Button, DownOutlined, Dropdown, Space } from '../../atoms';
import TextView from './TextView.tsx';

const LanguageMenu = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const currentLocale = getLocale();

    const languageMenuItems = ['en', 'fr'].sort().map((lang) => ({
        key: lang,
        onClick: () => {
            changeLocale(lang);
        },
        label: lang === 'en' ? 'English' : 'French',
        icon: <Avatar size={16} src={`/images/flags/${lang}.svg`} />,
    }));

    return (
        <Dropdown
            menu={{
                items: languageMenuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
            }}
        >
            <Button type="text">
                <Space>
                    <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
                    <TextView content={currentLocale === 'en' ? 'English' : 'French'} />
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default LanguageMenu;
