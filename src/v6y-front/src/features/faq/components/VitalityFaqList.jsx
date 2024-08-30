'use client';

import { QuestionOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityCollapse from '../../../commons/components/VitalityCollapse.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import { formatHelpOptions } from '../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import GetFaqsByParams from '../api/getFaqsByParams.js';


const VitalityFaqList = () => {
    const { isLoading: faqListLoading, data: dataFaqList } = useClientQuery({
        queryCacheKey: ['getFaqsByParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetFaqsByParams,
                queryParams: {},
            }),
    });

    const dataSource = formatHelpOptions(dataFaqList?.getFaqsByParams);

    return (
        <VitalitySectionView
            isLoading={faqListLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_FAQ_PAGE_TITLE}
            description=""
            avatar={<QuestionOutlined />}
        >
            <VitalityCollapse accordion bordered dataSource={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityFaqList;
