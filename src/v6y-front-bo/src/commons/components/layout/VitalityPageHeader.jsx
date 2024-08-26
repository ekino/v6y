'use client';

import { UserOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';
import { Layout as AntdLayout, Avatar, Space, Switch, Typography, theme } from 'antd';
import React, { useContext } from 'react';

import { ColorModeContext } from '../../../infrastructure/providers/ColorModeProvider.jsx';

const { Text } = Typography;
const { useToken } = theme;

export const VitalityPageHeader = () => {
    const { token } = useToken();
    const { data: user } = useGetIdentity();
    const { mode, setMode } = useContext(ColorModeContext);

    return (
        <AntdLayout.Header
            style={{
                backgroundColor: token.colorBgElevated,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                height: '4rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                margin: '0',
                padding: '1rem',
            }}
        >
            <Space size="large">
                <Switch
                    checkedChildren="🌛"
                    unCheckedChildren="🔆"
                    onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    defaultChecked={mode === 'dark'}
                />
                {user?.name && (
                    <div>
                        {user?.name && <Text strong>{user.name}</Text>}
                        {user?.avatar ? (
                            <Avatar src={user?.avatar} alt={user?.name} />
                        ) : (
                            <Avatar src={<UserOutlined />} alt={user?.name} />
                        )}
                    </div>
                )}
            </Space>
        </AntdLayout.Header>
    );
};
