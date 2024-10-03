import { NotificationType } from '@v6y/commons';

import VitalityCollapse from '../../../commons/components/VitalityCollapse';
import VitalityLinks from '../../../commons/components/VitalityLinks';
import { CollapseItemType } from '../../../commons/types/VitalityCollapseProps';

const VitalityNotificationList = ({ dataSource }: { dataSource: NotificationType[] }) => {
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
                        <VitalityLinks links={option.links || []} />
                    </>
                ),
                showArrow: true,
            }),
        );

    return <VitalityCollapse accordion bordered dataSource={notificationList} />;
};

export default VitalityNotificationList;
