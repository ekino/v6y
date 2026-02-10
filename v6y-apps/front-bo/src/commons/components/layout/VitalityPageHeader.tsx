'use client';

import * as React from 'react';

import Avatar from '@v6y/ui-kit/components/atoms/app/Avatar';
import Layout from '@v6y/ui-kit/components/atoms/app/Layout';
import Space from '@v6y/ui-kit/components/atoms/app/Space';
import LanguageMenu from '@v6y/ui-kit/components/organisms/app/LanguageMenu';
import TextView from '@v6y/ui-kit/components/organisms/app/TextView.tsx';
import { useAdminGetIdentity as useAdminEntity } from '@v6y/ui-kit/hooks/useAdminGetIdentity';

interface UserType {
    data: {
        name?: string;
        avatar?: string;
    };
}

export const VitalityPageHeader = () => {
    const { data: user } = useAdminEntity<UserType>();

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
