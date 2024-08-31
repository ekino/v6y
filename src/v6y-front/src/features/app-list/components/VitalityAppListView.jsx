'use client';

import { Col, Row } from 'antd';
import React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import VitalityKeywords from '../../../commons/components/keywords/VitalityKeywords.jsx';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import VitalityAppList from './VitalityAppList.jsx';

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
            <Col span={20}>
                <VitalityKeywords />
            </Col>
            <Col span={20}>
                <VitalityAppList />
            </Col>
        </Row>
    );
};

export default VitalityAppListView;
