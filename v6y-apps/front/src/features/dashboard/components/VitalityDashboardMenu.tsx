import { Col, Row, TitleView, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import { DashboardItemType } from '../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenuItem from './VitalityDashboardMenuItem';

const VitalityDashboardMenu = ({ options }: { options: DashboardItemType[] }) => {
    const { translate } = useTranslationProvider();

    return (
        <Row justify="center" align="middle" gutter={[12, 12]}>
            <Col span={20}>
                <TitleView title={translate('vitality.dashboardPage.menuTitle')} level={3} />
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
