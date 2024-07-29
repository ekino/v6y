import React from 'react';
import { Col, Row, Typography } from 'antd';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import VitalityDashboardMenuItem from './VitalityDashboardMenuItem.jsx';

const VitalityDashboardMenu = ({ options }) => {
    return (
        <Row
            justify="center"
            align="middle"
            gutter={[12, 12]}
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
            <Col span={20}>
                <Typography.Title level={3}>
                    {VitalityTerms.VITALITY_DASHBOARD_MENU_TITLE}
                </Typography.Title>
            </Col>
            {options?.map((option) => (
                <Col span={10} key={option?.title}>
                    <VitalityDashboardMenuItem option={option} />
                </Col>
            ))}
        </Row>
    );
};

export default VitalityDashboardMenu;
