'use client';

import React from 'react';
import { GET_NOTIFICATIONS } from '../../services';
import { buildGraphqlQuery, useGraphqlClient } from '../../commons/services/useGraphqlClient.jsx';
import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';
import VitalityLoader from '../../commons/components/VitalityLoader.jsx';
import VitalityConfig from '../../commons/config/VitalityConfig.js';
import VitalityCollapse from '../../commons/components/VitalityCollapse.jsx';
import VitalityEmptyView from '../../commons/components/VitalityEmptyView.jsx';
import CommonsDico from '../../commons/dico/CommonsDico.js';

const { formatHelpOptions } = VitalityConfig;

const NotificationList = () => {
    const { isLoading: notificationListLoading, data: dataNotificationList } = useGraphqlClient({
        queryKey: ['getNotificationList'],
        queryFn: async () =>
            buildGraphqlQuery({
                query: GET_NOTIFICATIONS,
                queryParams: {},
            }),
    });

    if (notificationListLoading) {
        return <VitalityLoader />;
    }

    const dataSource = formatHelpOptions(dataNotificationList?.getNotificationList);

    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_NOTIFICATIONS_PAGE_TITLE}>
            {!dataSource?.length ? (
                <VitalityEmptyView />
            ) : (
                <VitalityCollapse dataSource={dataSource} />
            )}
        </VitalityPageLayout>
    );
};

export default NotificationList;
