import { Card, Checkbox, Col, Row } from 'antd';
import dynamic from 'next/dynamic.js';
import React, { useEffect, useState } from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader.jsx';
import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper.jsx';

const VitalityModulesView = dynamic(
    () => import('../../../../../../commons/components/modules/VitalityModulesView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityCodeStatusReportsSmellGrouper = ({ reports }) => {
    const [selectedSmells, setSelectedSmells] = useState([]);
    const { criteriaGroups } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    useEffect(() => {
        setSelectedSmells([]);
    }, [reports]);

    const selectedReports = selectedSmells?.length
        ? (reports || []).filter((report) => selectedSmells?.includes(report?.category))
        : reports;

    return (
        <>
            <Card bordered>
                <Row gutter={[16, 24]} justify="center" align="middle">
                    <Col span={20}>
                        <Checkbox.Group
                            value={selectedSmells}
                            options={criteriaGroups}
                            onChange={(values) => setSelectedSmells(values)}
                        />
                    </Col>
                </Row>
            </Card>
            <VitalityModulesView modules={selectedReports} source="smells" />
        </>
    );
};

export default VitalityCodeStatusReportsSmellGrouper;
