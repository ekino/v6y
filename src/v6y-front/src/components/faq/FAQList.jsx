'use client';

import React from 'react';
import { GET_FAQ } from '../../services';
import { buildGraphqlQuery, useGraphqlClient } from '../../commons/services/useGraphqlClient.jsx';
import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';
import VitalityCollapse from '../../commons/components/VitalityCollapse.jsx';
import VitalityConfig from '../../commons/config/VitalityConfig.js';
import VitalityEmptyView from '../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../commons/components/VitalityLoader.jsx';
import CommonsDico from '../../commons/dico/CommonsDico.js';

const { formatHelpOptions } = VitalityConfig;

const FAQList = () => {
    const { isLoading: faqListLoading, data: dataFaqList } = useGraphqlClient({
        queryKey: ['getFaqList'],
        queryFn: async () =>
            buildGraphqlQuery({
                query: GET_FAQ,
                queryParams: {},
            }),
    });

    if (faqListLoading) {
        return <VitalityLoader />;
    }

    const dataSource = formatHelpOptions(dataFaqList?.getFaqList);

    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_FAQ_PAGE_TITLE}>
            {!dataSource?.length ? (
                <VitalityEmptyView />
            ) : (
                <VitalityCollapse accordion bordered dataSource={dataSource} />
            )}
        </VitalityPageLayout>
    );
};

export default FAQList;
