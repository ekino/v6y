'use client';

import * as React from 'react';

import { NotificationType } from '@v6y/core-logic/src/types';
import { NotificationOutlined, useTranslationProvider } from '@v6y/ui-kit';

import VitalitySectionView from '../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetNotificationListByPageAndParams from '../api/getNotificationListByPageAndParams';
import VitalityNotificationList from './VitalityNotificationList';

const VitalityNotificationView = () => {
    const { isLoading, data } = useClientQuery<{
        getNotificationListByPageAndParams: NotificationType[];
    }>({
        queryCacheKey: ['getNotificationListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetNotificationListByPageAndParams,
                variables: {},
            }),
    });

    const dataSource = data?.getNotificationListByPageAndParams;

    const { translate } = useTranslationProvider();
    return (
        <VitalitySectionView
            isLoading={isLoading}
            isEmpty={!dataSource?.length}
            title={translate('vitality.notificationsPage.pageTitle')}
            description=""
            avatar={<NotificationOutlined />}
        >
            <VitalityNotificationList dataSource={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityNotificationView;
