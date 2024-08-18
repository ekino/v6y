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
import GetNotificationList from '../api/getNotificationList.js';

const VitalityNotificationList = () => {
    const { isLoading: notificationListLoading, data: dataNotificationList } = useClientQuery({
        queryCacheKey: ['getNotificationList'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetNotificationList,
                queryParams: {},
            }),
    });

    if (notificationListLoading) {
        return <VitalityLoader />;
    }

    const dataSource = formatHelpOptions(dataNotificationList?.getNotificationList);

    if (!dataSource?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalityCollapse
            wrap
            title={
                <Typography.Title level={2}>
                    {VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE}
                </Typography.Title>
            }
            dataSource={dataSource}
        />
    );
};

export default VitalityNotificationList;
