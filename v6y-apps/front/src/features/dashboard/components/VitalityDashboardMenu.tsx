import { Col, Row, TitleView } from '@v6y/ui-kit';
import * as React from 'react';

import { DashboardItemType } from '../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import VitalityDashboardMenuItem from './VitalityDashboardMenuItem';

const VitalityDashboardMenu = ({ options }: { options: DashboardItemType[] }) => {
    return (
        <Row justify="center" align="middle" gutter={[12, 12]}>
            <Col span={20}>
                <TitleView title={VitalityTerms.VITALITY_DASHBOARD_MENU_TITLE} level={3} />
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
