import { VitalityTerms } from '@v6y/core-logic';
import { VitalityTitle } from '@v6y/shared-ui';
import { Col, Row } from 'antd';
import * as React from 'react';

import { DashboardItemType } from '../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenuItem from './VitalityDashboardMenuItem';

const VitalityDashboardMenu = ({ options }: { options: DashboardItemType[] }) => {
    return (
        <Row
            justify="center"
            align="middle"
            gutter={[12, 12]}
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
            <Col span={20}>
                <VitalityTitle title={VitalityTerms.VITALITY_DASHBOARD_MENU_TITLE} level={3} />
            </Col>
            {options?.map((option: DashboardItemType) => (
                <Col span={10} key={option?.title}>
                    <VitalityDashboardMenuItem option={option} />
                </Col>
            ))}
        </Row>
    );
};

export default VitalityDashboardMenu;
