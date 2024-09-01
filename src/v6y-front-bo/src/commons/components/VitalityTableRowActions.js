import { DeleteButton, EditButton, ShowButton } from '@refinedev/antd';
import { Space } from 'antd';

const VitalityTableRowActions = ({ record, metaQuery }) => (
    <Space>
        <EditButton hideText size="small" recordItemId={record.id} />
        <ShowButton hideText size="small" recordItemId={record.id} />
        <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource={record.id}
            meta={metaQuery}
        />
    </Space>
);

export default VitalityTableRowActions;
