import { DeleteButton, EditButton, ShowButton } from '@refinedev/antd';
import { Space } from 'antd';

const VitalityTableRowActions = ({ record, options }) => (
    <Space>
        {options?.enableEdit && <EditButton hideText size="small" recordItemId={record.id} />}
        {options?.enableShow && <ShowButton hideText size="small" recordItemId={record.id} />}
        {options?.enableDelete && (
            <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                resource={record.id}
                meta={options?.deleteMetaQuery}
            />
        )}
    </Space>
);

export default VitalityTableRowActions;
