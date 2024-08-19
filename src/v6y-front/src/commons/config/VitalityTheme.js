const themeToken = {
    colorTextBase: '#1a1a1a',
    colorTextLight: '#fff',
    colorPrimary: '#1976d2',
    colorPrimaryLight: '#e3f2fd',
    colorSecondary: '#81c784',
    colorTertiary: '#f5f5f5',
    colorBgHeader: 'linear-gradient(135deg, #1976d2 0%, rgb(0,208,130) 100%)',
    colorBgBase: '#fff',
    colorError: '#880e4f',
    colorInfo: '#9575cd',
    colorWarning: '#d50000', // Deeper orange, closer to red
    colorSuccess: '#2e7d32', // Darker green
    colorGray: '#eeeeee',
    colorLink: '#e65100',
    fontFamily: '"Graphik",arial,sans-serif',
    fontSize: 16,
    linkDecoration: 'underline',
    linkHoverDecoration: 'underline',
};

const vitalityTheme = {
    token: themeToken,
    components: {
        Button: {},
        Layout: {
            headerHeight: '5rem',
            bodyBg: themeToken.colorBgBase,
            headerBg: themeToken.colorBgHeader,
            footerBg: themeToken.colorBgHeader,
        },
        Menu: {
            itemBg: 'inheret',
        },
        Breadcrumb: {
            linkColor: themeToken.colorTextBase,
            separatorColor: themeToken.colorPrimary,
        },
        Collapse: {
            headerBg: themeToken.colorBgBase,
            colorBorder: themeToken.colorPrimary,
        },
        List: {
            headerBg: themeToken.colorTertiary,
            footerBg: themeToken.colorTertiary,
        },
    },
};

export default vitalityTheme;
