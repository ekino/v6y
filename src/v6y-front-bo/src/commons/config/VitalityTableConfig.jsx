import VitalityTableRowActions from '../components/VitalityTableRowActions.js';

export const buildApplicationTableDataSource = (dataSource) =>
    dataSource?.map((item) => ({
        ...item,
        key: item.id,
    }));

export const buildApplicationTableColumns = (dataSource) => [
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

export const buildCommonTableDataSource = (dataSource) =>
    dataSource?.map((item) => ({
        ...item,
        key: item.id,
    }));

export const buildCommonTableColumns = (dataSource, excludedKeys) => [
    ...(Object.keys(dataSource?.[0] || {})
        ?.filter((key) => key !== 'links' && !excludedKeys?.includes(key))
        ?.map((key) => ({
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
