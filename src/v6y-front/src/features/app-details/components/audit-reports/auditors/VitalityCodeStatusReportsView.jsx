import { Checkbox, Col, Row } from 'antd';
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
        <Row gutter={[16, 24]} justify="center" align="middle">
            <Col span={20}>
                <Checkbox.Group
                    value={selectedSmells}
                    options={criteriaGroups}
                    onChange={(values) => setSelectedSmells(values)}
                />
            </Col>
            {metrics?.map((metric, index) => (
                <Col
                    key={`${metric.title}}-${metric.description}-${index}`}
                    xs={22}
                    sm={22}
                    md={22}
                    lg={22}
                    xl={12}
                >
                    <VitalityMetricDetailsView metric={metric} />
                </Col>
            ))}
        </Row>
    );
};

export default VitalityCodeStatusReportsView;
