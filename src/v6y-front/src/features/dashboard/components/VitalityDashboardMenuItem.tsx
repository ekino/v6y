import { DashboardItemType } from '@/commons/config/VitalityCommonConfig';
import { Avatar, Card, Typography } from 'antd';
import Link from 'next/link';
import * as React from 'react';

const VitalityDashboardMenuItem = ({ option }: { option: DashboardItemType }) => {
    if (!option) {
        return null;
    }

    return (
        <Link href={option.url} style={{ textDecoration: 'none' }}>
            <Card bordered hoverable>
                <Card.Meta
                    avatar={
                        <Avatar
                            size={32}
                            icon={option.avatar}
                            style={{ backgroundColor: option.avatarColor }}
                        />
                    }
                    title={
                        <Typography.Title level={4} underline>
                            {option.title}
                        </Typography.Title>
                    }
                    description={<Typography.Text>{option.description}</Typography.Text>}
                />
            </Card>
        </Link>
    );
};

export default VitalityDashboardMenuItem;
