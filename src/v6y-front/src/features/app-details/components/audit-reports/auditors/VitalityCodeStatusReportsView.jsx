import { Checkbox, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import VitalityEmptyView from '../../../../../commons/components/VitalityEmptyView.jsx';
import useDataGrouper from '../../../../../commons/hooks/useDataGrouper.jsx';
import VitalityMetricDetailsView from './VitalityMetricDetailsView.jsx';

const VitalityCodeStatusReportsView = ({ reports }) => {
    const [selectedSmells, setSelectedSmells] = useState([]);
    const { criteriaGroups } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    useEffect(() => {
        setSelectedSmells([]);
    }, [reports]);

    if (!reports?.length || !criteriaGroups?.length) {
        return <VitalityEmptyView />;
    }

    const metrics = selectedSmells?.length
        ? (reports || []).filter((report) => selectedSmells?.includes(report?.category))
        : reports;

    return (
        <Space direction="vertical" size="middle">
            <Checkbox.Group
                value={selectedSmells}
                options={criteriaGroups}
                onChange={(values) => setSelectedSmells(values)}
            />
            <Space size="middle" direction="vertical">
                {metrics?.map((metric, index) => (
                    <VitalityMetricDetailsView
                        key={`${metric.title}}-${metric.description}-${index}`}
                        metric={metric}
                    />
                ))}
            </Space>
        </Space>
    );
};

export default VitalityCodeStatusReportsView;
