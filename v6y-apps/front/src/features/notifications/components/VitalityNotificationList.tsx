import { NotificationType } from '@v6y/core-logic/src/types/NotificationType';
import { CollapseItemType, CollapseView, Links } from '@v6y/ui-kit';

const VitalityNotificationList = ({ dataSource }: { dataSource?: NotificationType[] }) => {
    if (!dataSource?.length) {
        return null;
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
                        <Links links={option.links || []} />
                    </>
                ),
                showArrow: true,
            }),
        );

    return <CollapseView accordion bordered dataSource={notificationList} />;
};

export default VitalityNotificationList;
