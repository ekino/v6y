'use client';

import { Col, DynamicLoader, Row, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';

const VitalitySelectableIndicators = DynamicLoader(
    () => import('../../../commons/components/indicators/VitalitySelectableIndicators'),
);

const VitalityAppList = DynamicLoader(() => import('./VitalityAppList'));

const VitalityAppListView = () => {
    const { translate } = useTranslationProvider();
    return (
        <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
                <VitalitySearchBar
                    placeholder={translate('vitality.searchPage.inputPlaceholder')}
                    helper={translate('vitality.searchPage.inputHelper')}
                    label={translate('vitality.searchPage.inputLabel')}
                />
            </Col>
            <Col span={22}>
                <VitalitySelectableIndicators />
            </Col>
            <Col span={22}>
                <VitalityAppList />
            </Col>
        </Row>
    );
};

export default VitalityAppListView;
