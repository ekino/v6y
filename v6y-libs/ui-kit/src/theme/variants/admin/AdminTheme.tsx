import { RefineThemes } from '@refinedev/antd';

const AdminTheme = {
    ...RefineThemes.Purple,
    token: {
        ...(RefineThemes.Purple?.token ?? {}),
        // Keep typography inherited from the app root (next/font/local class on <html>).
        fontFamily: 'inherit',
    },
    type: 'admin-default',
    status: {},
    statusIcons: {},
};

export default AdminTheme;
