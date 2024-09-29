import { AuditType } from '@v6y/commons';
import { Card, Checkbox, Col, Row } from 'antd';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader';
import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityModulesView = dynamic(
    () => import('../../../../../../commons/components/modules/VitalityModulesView'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityCodeStatusReportsSmellGrouper = ({ reports }: { reports: AuditType[] }) => {
    const [selectedSmells, setSelectedSmells] = useState<string[]>();
    const { criteriaGroups } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    useEffect(() => {
        setSelectedSmells([]);
    }, [reports]);

    const selectedReports = selectedSmells?.length
        ? (reports || []).filter(
              (report) => report?.category && selectedSmells?.includes(report.category),
          )
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
            <VitalityModulesView
                modules={selectedReports as VitalityModuleType[]}
                source="smells"
            />
        </>
    );
};

export default VitalityCodeStatusReportsSmellGrouper;
