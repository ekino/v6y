'use client';

import {
    Avatar,
    Layout,
    Space,
    VitalityLanguageSettings,
    VitalityText,
    useAdminGetIdentity,
    useTheme,
} from '@v6y/shared-ui';
import * as React from 'react';

interface UserType {
    data: {
        name?: string;
        avatar?: string;
    };
}

export const VitalityPageHeader = () => {
    const { themeToken } = useTheme();
    const { data: user } = useAdminGetIdentity() as UserType;

    return (
        <Layout.Header
            style={{
                backgroundColor: themeToken.colorBgElevated,
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
            <VitalityLanguageSettings />
            {(user?.name || user?.avatar) && (
                <Space style={{ marginLeft: '8px' }} size="middle">
                    {user?.name && <VitalityText strong text={user.name} />}
                    {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
                </Space>
            )}
        </Layout.Header>
    );
};
