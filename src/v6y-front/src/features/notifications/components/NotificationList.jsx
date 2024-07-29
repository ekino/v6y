'use client';

import React from 'react';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityCommonUtils from '../../../commons/utils/VitalityCommonUtils.js';
import VitalityCollapse from '../../../commons/components/VitalityCollapse.jsx';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import GetNotificationList from '../api/getNotificationList.js';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';

const { formatHelpOptions } = VitalityCommonUtils;

const NotificationList = () => {
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

    return (
        <>
            {!dataSource?.length ? (
                <VitalityEmptyView />
            ) : (
                <VitalityCollapse dataSource={dataSource} />
            )}
        </>
    );
};

export default NotificationList;
