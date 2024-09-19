'use client';

import { Col, Row } from 'antd';
import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';


const VitalityCheckableKeywords = dynamic(
    () => import('../../../commons/components/indicators/VitalitySelectableIndicators.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityAppList = dynamic(() => import('./VitalityAppList.jsx'), {
    loading: () => <VitalityLoader />,
});

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
