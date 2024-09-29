'use client';

import VitalityEmptyView from '@/commons/components/VitalityEmptyView';
import { buildClientQuery, useClientQuery } from '@/infrastructure/adapters/api/useQueryAdapter';
import { NotificationOutlined } from '@ant-design/icons';
import { NotificationType } from '@v6y/commons';

import VitalityCollapse from '../../../commons/components/VitalityCollapse';
import VitalityLinks from '../../../commons/components/VitalityLinks';
import VitalitySectionView from '../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import { CollapseItemType } from '../../../commons/types/VitalityCollapseProps';
import GetNotificationListByPageAndParams from '../api/getNotificationListByPageAndParams';

interface VitalityNotificationQueryType {
    isLoading: boolean;
    data?: { getNotificationListByPageAndParams: NotificationType[] };
}

const VitalityNotificationList = () => {
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

    const notificationList: CollapseItemType[] = dataSource
        .filter((option: NotificationType) => option.title?.length)
        .map(
            (option: NotificationType): CollapseItemType => ({
                key: option.title || '',
                label: option.title || '',
                children: (
                    <>
                        <p>{option.description}</p>
                        <VitalityLinks links={option.links || []} />
                    </>
                ),
                showArrow: true,
            }),
        );

    return (
        <VitalitySectionView
            isLoading={isLoading}
            isEmpty={!notificationList?.length}
            title={VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE}
            description=""
            avatar={<NotificationOutlined />}
        >
            {notificationList?.length > 0 && (
                <VitalityCollapse accordion bordered dataSource={notificationList} />
            )}
        </VitalitySectionView>
    );
};

export default VitalityNotificationList;
