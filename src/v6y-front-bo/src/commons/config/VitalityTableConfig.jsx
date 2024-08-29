import VitalityTableRowActions from '../components/VitalityTableRowActions.js';

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
        render: (_, record) => <VitalityTableRowActions record={record} />,
    },
];
