import * as React from 'react';

import { useTranslationProvider } from '../../../translation/useTranslationProvider';
import { Avatar, Button, DownOutlined, Dropdown, Space } from '../../atoms';
import TextView from './TextView.tsx';

const LanguageMenu = () => {
    const { getLocale, changeLocale } = useTranslationProvider();
    const [mounted, setMounted] = React.useState(false);
    const currentLocale = getLocale();

    // Only render after client-side hydration to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const languageMenuItems = ['en', 'fr'].sort().map((lang) => ({
        key: lang,
        onClick: () => {
            changeLocale(lang);
        },
        label: lang === 'en' ? 'English' : 'French',
        icon: <Avatar size={16} src={`/images/flags/${lang}.svg`} />,
    }));

    // Show a placeholder during SSR to match initial render
    if (!mounted) {
        return (
            <Button type="text" disabled>
                <Space>
                    <Avatar size={16} src="/images/flags/en.svg" />
                    <TextView content="English" />
                    <DownOutlined />
                </Space>
            </Button>
        );
    }

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
