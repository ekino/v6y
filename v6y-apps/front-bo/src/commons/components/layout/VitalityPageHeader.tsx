'use client';

import { Avatar, LanguageMenu, Layout, Space, TextView, useAdminGetIdentity } from '@v6y/shared-ui';
import * as React from 'react';

interface UserType {
    data: {
        name?: string;
        avatar?: string;
    };
}

export const VitalityPageHeader = () => {
    const { data: user } = useAdminGetIdentity() as UserType;

    return (
        <Layout.Header>
            <LanguageMenu />
            {(user?.name || user?.avatar) && (
                <Space size="middle">
                    {user?.name && <TextView strong content={user.name} />}
                    {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
                </Space>
            )}
        </Layout.Header>
    );
};
