const themeToken = {
    colorTextBase: '#1a1a1a',
    colorPrimary: '#0693e3',
    colorBgBase: '#fff',
    colorError: '#cf2e2e',
    colorInfo: '#0693e3',
    colorLink: '#ff6900',
    colorSuccess: '#00d084',
    colorWarning: '#ff6900',
    fontFamily: '"Graphik",arial,sans-serif',
    fontSize: 16,
};

const theme = {
    token: themeToken,
    components: {
        Button: {
            primaryColor: '#000000',
        },
        Layout: {
            headerHeight: '5rem',
            bodyBg: '#fff',
            headerBg: themeToken.colorPrimary,
            footerBg: themeToken.colorPrimary,
        },
        Menu: {
            itemBg: themeToken.colorPrimary,
        },
        Breadcrumb: {
            linkColor: '#1a1a1a',
        },
    },
};

export default theme;
