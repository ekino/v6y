import React from 'react';
import { Card } from 'antd';
import Link from 'next/link';

const VitalityDashboardMenuItem = ({ option }) => {
    return (
        <Link href={option.url}>
            <Card bordered hoverable>
                <Card.Meta title={option.title} description={option.description} />
            </Card>
        </Link>
    );
};

export default VitalityDashboardMenuItem;
