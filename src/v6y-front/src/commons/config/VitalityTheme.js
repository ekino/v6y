const themeToken = {
    colorTextBase: '#1a1a1a',
    colorTextLight: '#fff',
    colorPrimary: '#fcb900',
    colorSecondary: '#abb8c3',
    colorTertiary: '#f2f2f2',
    colorBgHeader: '#abb8c3',
    colorBgBase: '#fff',
    colorError: '#cf2e2e',
    colorInfo: '#0693e3',
    colorSuccess: '#00d084',
    colorWarning: '#ff6900',
    colorGray: '#f6f6f6',
    colorLink: '#ff6900',
    fontFamily: '"Graphik",arial,sans-serif',
    fontSize: 16,
    linkDecoration: 'underline',
    linkHoverDecoration: 'underline',
};

const vitalityTheme = {
    token: themeToken,
    components: {
        Button: {
            defaultHoverBorderColor: null,
            defaultHoverColor: themeToken.colorTextBase,
            defaultHoverBg: themeToken.colorPrimary,
        },
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
            separatorColor: themeToken.colorSecondary,
        },
        Collapse: {
            headerBg: themeToken.colorTertiary,
        },
        Card: {
            // actionsBg: themeToken.colorBgHeader,
        },
        List: {
            headerBg: themeToken.colorTertiary,
            footerBg: themeToken.colorTertiary,
        },
    },
};

export default vitalityTheme;
