'use client';

import { QuestionOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityCollapse from '../../../commons/components/VitalityCollapse.jsx';
import VitalityLinks from '../../../commons/components/VitalityLinks.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import GetFaqListByPageAndParams from '../api/getFaqListByPageAndParams.js';

const VitalityFaqList = () => {
    const { isLoading: faqListLoading, data: dataFaqList } = useClientQuery({
        queryCacheKey: ['getFaqListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetFaqListByPageAndParams,
                queryParams: {},
            }),
    });

    const dataSource = (dataFaqList?.getFaqListByPageAndParams || [])
        .filter((option) => option.title?.length)
        .map((option) => ({
            key: option.title,
            label: option.title,
            children: (
                <>
                    <p>{option.description}</p>
                    <VitalityLinks links={option.links || []} />
                </>
            ),
            showArrow: true,
        }));

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
