import VitalityTableRowActions from '../components/VitalityTableRowActions.js';

export const buildCommonTableDataSource = (dataSource) =>
    dataSource?.map((item) => ({
        ...item,
        key: item.id,
    }));

export const buildCommonTableColumns = (dataSource, excludedKeys, options) => [
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
        render: (_, record) => <VitalityTableRowActions record={record} options={options} />,
    },
];
