'use client';

import { Col, DynamicLoader, Row } from '@v6y/shared-ui';
import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import VitalityTerms from '../../../commons/config/VitalityTerms';

const VitalitySelectableIndicators = DynamicLoader(
    () => import('../../../commons/components/indicators/VitalitySelectableIndicators'),
);

const VitalityAppList = DynamicLoader(() => import('./VitalityAppList'));

const VitalityAppListView = () => {
    return (
        <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
                <VitalitySearchBar
                    placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                    helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                    label={VitalityTerms.VITALITY_SEARCHBAR_INPUT_LABEL}
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
