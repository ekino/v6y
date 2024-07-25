import React from 'react';
import { Row, Typography } from 'antd';
import CommonsDico from '../dico/CommonsDico.js';
import VitalityVerticalMenuItem from './VitalityVerticalMenuItem.jsx';

const VitalityVerticalMenu = ({ options }) => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <Typography.Title level={3} style={{ width: '50%' }}>
                {CommonsDico.VITALITY_DASHBOARD_MENU_TITLE}
            </Typography.Title>
            <Row gutter={[12, 12]} justify="center" align="center" style={{ width: '50%' }}>
                {options?.map((option) => (
                    <VitalityVerticalMenuItem key={option?.title} option={option} />
                ))}
            </Row>
        </div>
    );
};

export default VitalityVerticalMenu;
