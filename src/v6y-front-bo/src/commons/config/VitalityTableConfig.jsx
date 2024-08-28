import { DeleteButton, EditButton, ShowButton } from '@refinedev/antd';
import { Space } from 'antd';

export const buildTableDataSource = (dataSource) =>
    dataSource?.map((item) => ({
        ...item,
        key: item.id,
    }));

export const buildTableColumns = (dataSource) => [
    ...(Object.keys(dataSource?.[0] || {})?.map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
    })) || []),
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
        ),
    },
];
