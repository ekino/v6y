import * as React from 'react';

import { DislikeOutlined, LikeOutlined, ThunderboltOutlined } from '../../../components/atoms';

const ThemeTokensConfig = {
    colorTextBase: '#1a1a1a',
    colorTextLight: '#fff',
    colorPrimary: '#1976d2',
    colorPrimaryLight: '#e3f2fd',
    colorSecondary: '#81c784',
    colorTertiary: '#f5f5f5',
    colorBgHeader: 'linear-gradient(135deg, #1976d2 0%, rgb(0,208,130) 100%)',
    colorBgBase: '#fff',
    colorError: '#d50000',
    colorInfo: '#1976d2',
    colorWarning: '#e65100', // Deeper orange, closer to red
    colorSuccess: '#2e7d32', // Darker green
    colorGray: '#eeeeee',
    colorLink: '#880e4f',
    fontFamily: '"Graphik",arial,sans-serif',
    fontSize: 16,
    linkDecoration: 'underline',
    linkHoverDecoration: 'underline',
};

const ThemeComponentsConfig = {
    Button: {},
    Layout: {
        headerHeight: '5rem',
        bodyBg: ThemeTokensConfig.colorBgBase,
        headerBg: ThemeTokensConfig.colorBgHeader,
        footerBg: ThemeTokensConfig.colorBgHeader,
    },
    Menu: {
        itemBg: 'inheret',
    },
    Breadcrumb: {
        linkColor: ThemeTokensConfig.colorTextBase,
        separatorColor: ThemeTokensConfig.colorPrimary,
    },
    Collapse: {
        headerBg: ThemeTokensConfig.colorBgBase,
        colorBorder: ThemeTokensConfig.colorPrimary,
    },
    List: {
        headerBg: ThemeTokensConfig.colorTertiary,
        footerBg: ThemeTokensConfig.colorTertiary,
    },
};

const ThemeStatusConfig = {
    success: ThemeTokensConfig.colorSuccess,
    warning: ThemeTokensConfig.colorWarning,
    error: ThemeTokensConfig.colorError,
    'up-to-date': ThemeTokensConfig.colorSuccess,
    outdated: ThemeTokensConfig.colorWarning,
    deprecated: ThemeTokensConfig.colorError,
    default: ThemeTokensConfig.colorInfo,
    important: ThemeTokensConfig.colorWarning,
    critical: ThemeTokensConfig.colorError,
    recommended: ThemeTokensConfig.colorInfo,
};

const ThemeStatusIcons = {
    success: <LikeOutlined />,
    warning: <DislikeOutlined />,
    error: <DislikeOutlined />,
    'up-to-date': <LikeOutlined />,
    outdated: <DislikeOutlined />,
    deprecated: <DislikeOutlined />,
    default: <ThunderboltOutlined />,
    info: <ThunderboltOutlined />,
    important: <ThunderboltOutlined />,
    critical: <ThunderboltOutlined />,
    recommended: <ThunderboltOutlined />,
};

const AppTheme = {
    type: 'app-default',
    components: ThemeComponentsConfig,
    token: ThemeTokensConfig,
    status: ThemeStatusConfig,
    statusIcons: ThemeStatusIcons,
};

export default AppTheme;
