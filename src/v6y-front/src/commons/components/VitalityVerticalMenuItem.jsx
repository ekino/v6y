import React from 'react';
import { Card, Col } from 'antd';
import Link from 'next/link.js';

const VitalityVerticalMenuItem = ({ option }) => {
    return (
        <Col span={12}>
            <Link href={option.url}>
                <Card bordered hoverable>
                    <Card.Meta title={option.title} description={option.description} />
                </Card>
            </Link>
        </Col>
    );
};

export default VitalityVerticalMenuItem;
