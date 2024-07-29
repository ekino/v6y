const themeToken = {
    colorTextBase: '#1a1a1a',
    colorTextLight: '#fff',
    colorPrimary: 'linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%)',
    colorSecondary: '#1E73BE',
    colorBgHeader:
        'linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%)',
    colorBgBase: '#fff',
    colorError: '#cf2e2e',
    colorInfo: '#0693e3',
    colorLink: '#ff6900',
    colorSuccess: '#00d084',
    colorWarning: '#ff6900',
    colorGray: '#f6f6f6',
    fontFamily: '"Graphik",arial,sans-serif',
    fontSize: 16,
};

const theme = {
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
        },
        Collapse: {
            headerBg: themeToken.colorPrimary,
        },
    },
};

export default theme;
