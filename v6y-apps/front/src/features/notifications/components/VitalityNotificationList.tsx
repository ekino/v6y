import { NotificationType } from '@v6y/core-logic';
import VitalityCollapse from '@v6y/shared-ui/src/components/VitalityCollapse/VitalityCollapse';
import { CollapseItemType } from '@v6y/shared-ui/src/types/VitalityCollapseProps';

import VitalityLinks from '../../../commons/components/VitalityLinks';

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
