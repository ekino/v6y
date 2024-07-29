'use client';

import React from 'react';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import VitalityCollapse from '../../../commons/components/VitalityCollapse.jsx';
import VitalityCommonUtils from '../../../commons/utils/VitalityCommonUtils.js';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import GetFaqList from '../api/getFaqList.js';

const { formatHelpOptions } = VitalityCommonUtils;

const FAQList = () => {
    const { isLoading: faqListLoading, data: dataFaqList } = useClientQuery({
        queryCacheKey: ['getFaqList'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetFaqList,
                queryParams: {},
            }),
    });

    if (faqListLoading) {
        return <VitalityLoader />;
    }

    const dataSource = formatHelpOptions(dataFaqList?.getFaqList);

    return (
        <>
            {!dataSource?.length ? (
                <VitalityEmptyView />
            ) : (
                <VitalityCollapse accordion bordered dataSource={dataSource} />
            )}
        </>
    );
};

export default FAQList;
