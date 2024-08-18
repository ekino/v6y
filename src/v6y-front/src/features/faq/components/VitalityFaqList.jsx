'use client';

import { Typography } from 'antd';
import React from 'react';

import VitalityCollapse from '../../../commons/components/VitalityCollapse.jsx';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import { formatHelpOptions } from '../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import GetFaqList from '../api/getFaqList.js';

const VitalityFaqList = () => {
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

    if (!dataSource?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalityCollapse
            accordion
            bordered
            wrap
            title={
                <Typography.Title level={2}>
                    {VitalityTerms.VITALITY_FAQ_PAGE_TITLE}
                </Typography.Title>
            }
            dataSource={dataSource}
        />
    );
};

export default VitalityFaqList;
