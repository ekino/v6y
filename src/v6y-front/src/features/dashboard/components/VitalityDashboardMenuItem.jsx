import { Card, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

const VitalityDashboardMenuItem = ({ option }) => {
    return (
        <Link href={option.url}>
            <Card bordered hoverable>
                <Card.Meta
                    title={<Typography.Title level={4}>{option.title}</Typography.Title>}
                    description={<Typography.Text>{option.description}</Typography.Text>}
                />
            </Card>
        </Link>
    );
};

export default VitalityDashboardMenuItem;
