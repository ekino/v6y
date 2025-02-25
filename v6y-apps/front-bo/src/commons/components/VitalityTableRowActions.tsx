import { AdminTableOptions, DeleteButton, EditButton, ShowButton, Space } from '@v6y/shared-ui';

type TableRowActionType<T> = T & {
    _id: string;
};

const VitalityTableRowActions = <T,>({
    record,
    options,
}: {
    record: T;
    options: AdminTableOptions;
}) => {
    return (
        <Space>
            {options?.enableEdit && (
                <EditButton
                    hideText
                    size="small"
                    recordItemId={(record as TableRowActionType<T>)._id}
                />
            )}
            {options?.enableShow && (
                <ShowButton
                    hideText
                    size="small"
                    recordItemId={(record as TableRowActionType<T>)._id}
                />
            )}
            {options?.enableDelete && (
                <DeleteButton
                    hideText
                    size="small"
                    recordItemId={`${(record as TableRowActionType<T>)._id}`}
                    resource={`${(record as TableRowActionType<T>)._id}`}
                    meta={options?.deleteMetaQuery}
                />
            )}
        </Space>
    );
};

export default VitalityTableRowActions;
