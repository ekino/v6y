import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';


const useDataGrouper = ({ dataSource, criteria, hasAllGroup }) => {
    const [groupedDataSource, setGroupedDataSource] = useState({});
    const [criteriaGroups, setCriteriaGroups] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState({});

    useEffect(() => {
        const groups = dataSource?.reduce?.(
            (acc, item) => ({
                ...acc,
                [item[criteria]]: [...(acc[item[criteria]] || []), item],
            }),
            {},
        );
        setGroupedDataSource(groups);
    }, [dataSource, criteria]);

    useEffect(() => {
        const groups = Object.keys(groupedDataSource || {})?.map((group) => ({
            key: group,
            value: group,
            label: <Typography.Text>{group}</Typography.Text>,
        }));
        setCriteriaGroups(
            [
                hasAllGroup
                    ? {
                          key: 'All',
                          value: 'All',
                          label: <Typography.Text>All</Typography.Text>,
                      }
                    : null,
                ...(groups || []),
            ].filter((item) => item),
        );
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
