'use client';

import VitalityEmptyView from '@/commons/components/VitalityEmptyView';
import { buildClientQuery, useClientQuery } from '@/infrastructure/adapters/api/useQueryAdapter';
import { QuestionOutlined } from '@ant-design/icons';
import { FaqType } from '@v6y/commons';
import * as React from 'react';

import VitalityCollapse from '../../../commons/components/VitalityCollapse';
import VitalityLinks from '../../../commons/components/VitalityLinks';
import VitalitySectionView from '../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import { CollapseItemType } from '../../../commons/types/VitalityCollapseProps';
import GetFaqListByPageAndParams from '../api/getFaqListByPageAndParams';

interface VitalityFaqQueryType {
    isLoading: boolean;
    data?: { getFaqListByPageAndParams: FaqType[] };
}

const VitalityFaqList = () => {
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
    if (!dataSource) {
        return <VitalityEmptyView />;
    }

    const faqList: CollapseItemType[] = dataSource
        .filter((option: FaqType) => option.title?.length)
        .map((option: FaqType) => ({
            key: option.title || '',
            label: option.title || '',
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
            isLoading={isLoading}
            isEmpty={!faqList?.length}
            title={VitalityTerms.VITALITY_FAQ_PAGE_TITLE}
            description=""
            avatar={<QuestionOutlined />}
        >
            <VitalityCollapse accordion bordered dataSource={faqList} />
        </VitalitySectionView>
    );
};

export default VitalityFaqList;
