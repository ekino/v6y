import { Avatar, Button, Dropdown, Space } from 'antd';
import * as React from 'react';

import { useTranslationProvider } from '../../../translation/useTranslationProvider';
import { DownOutlined } from '../../atoms';
import VitalityText from './VitalityText';

const VitalityLanguageSettings = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const currentLocale = getLocale();

    const languageMenuItems = ['en', 'fr'].sort().map((lang) => ({
        key: lang,
        onClick: () => {
            changeLocale(lang);
        },
        label: lang === 'en' ? 'English' : 'French',
        icon: (
            <span style={{ marginRight: 8 }}>
                <Avatar size={16} src={`/images/flags/${lang}.svg`} />
            </span>
        ),
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
                    <VitalityText text={currentLocale === 'en' ? 'English' : 'French'} />
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    );
};

export default VitalityLanguageSettings;
