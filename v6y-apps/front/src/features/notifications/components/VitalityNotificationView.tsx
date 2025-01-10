'use client';

import { NotificationOutlined } from '@ant-design/icons';
import { NotificationType } from '@v6y/core-logic';

import VitalityEmptyView from '../../../commons/components/VitalityEmptyView';
import VitalitySectionView from '../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetNotificationListByPageAndParams from '../api/getNotificationListByPageAndParams';
import VitalityNotificationList from './VitalityNotificationList';

interface VitalityNotificationQueryType {
    isLoading: boolean;
    data?: { getNotificationListByPageAndParams: NotificationType[] };
}

const VitalityNotificationView = () => {
    const { isLoading, data }: VitalityNotificationQueryType = useClientQuery({
        queryCacheKey: ['getNotificationListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetNotificationListByPageAndParams,
                variables: {},
            }),
    });

    const dataSource = data?.getNotificationListByPageAndParams;
    if (!dataSource) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalitySectionView
            isLoading={isLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE}
            description=""
            avatar={<NotificationOutlined />}
        >
            <VitalityNotificationList dataSource={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityNotificationView;