'use client';

import { NotificationOutlined } from '@ant-design/icons';
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
import GetNotificationsByParams from '../api/getNotificationsByParams.js';

const VitalityNotificationList = () => {
    const { isLoading: notificationListLoading, data: dataNotificationList } = useClientQuery({
        queryCacheKey: ['getNotificationsByParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetNotificationsByParams,
                queryParams: {},
            }),
    });

    const dataSource = formatHelpOptions(dataNotificationList?.getNotificationsByParams);

    return (
        <VitalitySectionView
            isLoading={notificationListLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE}
            description=""
            avatar={<NotificationOutlined />}
        >
            <VitalityCollapse accordion bordered dataSource={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityNotificationList;