import {
    CriteriaGroup,
    DataGrouperParams,
    DataGrouperReturn,
} from '@/commons/hooks/DataGrouperType';
import { Typography } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';

const useDataGrouper = ({
    dataSource,
    criteria,
    hasAllGroup,
}: DataGrouperParams): DataGrouperReturn => {
    const [groupedDataSource, setGroupedDataSource] = useState({});
    const [criteriaGroups, setCriteriaGroups] = useState<CriteriaGroup[]>([]);
    const [selectedCriteria, setSelectedCriteria] = useState<CriteriaGroup>({
        label: undefined,
        key: 'All',
        value: 'All',
    });

    useEffect(() => {
        const groups = dataSource?.reduce<Record<string, Record<string, unknown>[]>>(
            (acc, item) => {
                const key = (item as Record<string, unknown>)[criteria] as string;
                acc[key] = [...(acc[key] || []), item as Record<string, unknown>];
                return acc;
            },
            {},
        );
        setGroupedDataSource(groups as Record<string, Record<string, unknown>[]>);
    }, [dataSource, criteria]);

    useEffect(() => {
        const groups = Object.keys(groupedDataSource || {})?.map((group) => ({
            key: group,
            value: group,
            label: <Typography.Text>{group}</Typography.Text>,
        }));

        if (hasAllGroup) {
            const hasAllGroup = {
                key: 'All',
                value: 'All',
                label: <Typography.Text>All</Typography.Text>,
            };
            setCriteriaGroups([hasAllGroup, ...(groups || [])]);
        } else {
            setCriteriaGroups(groups || []);
        }
    }, [groupedDataSource, hasAllGroup]);

    useEffect(() => {
        setSelectedCriteria(criteriaGroups?.[0]);
    }, [criteriaGroups]);

    return {
        criteriaGroups,
        groupedDataSource,
        selectedCriteria,
        setSelectedCriteria,
    };
};

export default useDataGrouper;
