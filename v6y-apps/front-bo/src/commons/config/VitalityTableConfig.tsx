import { AdminTableOptions } from '@v6y/ui-kit/components/types/AdminTableType';

import VitalityTableRowActions from '../components/VitalityTableRowActions';

type TableRecordType<T> = T & {
    _id: string;
};

export const buildCommonTableDataSource = <T,>(dataSource: T[]) =>
    dataSource?.map((item: T) => ({
        ...item,
        key: (item as TableRecordType<T>)._id,
    }));

export const buildCommonTableColumns = <T,>(
    dataSource: T[],
    excludedKeys: string[],
    options: AdminTableOptions,
) => [
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
        render: (_: unknown, record: T) => (
            <VitalityTableRowActions record={record} options={options} />
        ),
    },
];
