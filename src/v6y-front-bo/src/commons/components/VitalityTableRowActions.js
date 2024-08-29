import { DeleteButton, EditButton, ShowButton } from '@refinedev/antd';
import { Space } from 'antd';

import DeleteApplication from '../../features/v6y-applications/apis/deleteApplication.js';

const VitalityTableRowActions = ({ record }) => (
    <Space>
        <EditButton hideText size="small" recordItemId={record.id} />
        <ShowButton hideText size="small" recordItemId={record.id} />
        <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource={record.id}
            meta={{
                gqlMutation: DeleteApplication,
                operation: 'deleteApplication',
            }}
        />
    </Space>
);

export default VitalityTableRowActions;
