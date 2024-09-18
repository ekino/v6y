'use client';

import { NotificationOutlined } from '@ant-design/icons';
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
import GetNotificationListByPageAndParams from '../api/getNotificationListByPageAndParams.js';

const VitalityNotificationList = () => {
    const { isLoading: notificationListLoading, data: dataNotificationList } = useClientQuery({
        queryCacheKey: ['getNotificationListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetNotificationListByPageAndParams,
                queryParams: {},
            }),
    });

    const dataSource = (dataNotificationList?.getNotificationListByPageAndParams || [])
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
