'use client';

import { FaqType } from '@v6y/core-logic/src/types';
import { QuestionOutlined } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetFaqListByPageAndParams from '../api/getFaqListByPageAndParams';
import VitalityFaqList from './VitalityFaqList';

interface VitalityFaqQueryType {
    isLoading: boolean;
    data?: { getFaqListByPageAndParams: FaqType[] };
}

const VitalityFaqView = () => {
    const { isLoading, data }: VitalityFaqQueryType = useClientQuery({
        queryCacheKey: ['getFaqListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetFaqListByPageAndParams,
                variables: {},
            }),
    });

    const dataSource = data?.getFaqListByPageAndParams;

    return (
        <VitalitySectionView
            isLoading={isLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_FAQ_PAGE_TITLE}
            description=""
            avatar={<QuestionOutlined />}
        >
            <VitalityFaqList dataSource={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityFaqView;
