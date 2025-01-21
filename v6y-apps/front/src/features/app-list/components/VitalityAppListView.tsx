'use client';

import { VitalityTerms } from '@v6y/core-logic';
import { Col, Row } from 'antd';
import * as React from 'react';

import VitalityDynamicLoader from '../../../commons/components/VitalityDynamicLoader';
import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';

const VitalityCheckableKeywords = VitalityDynamicLoader(
    () => import('../../../commons/components/indicators/VitalitySelectableIndicators'),
);

const VitalityAppList = VitalityDynamicLoader(() => import('./VitalityAppList'));

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
                <VitalityCheckableKeywords />
            </Col>
            <Col span={22}>
                <VitalityAppList />
            </Col>
        </Row>
    );
};

export default VitalityAppListView;
