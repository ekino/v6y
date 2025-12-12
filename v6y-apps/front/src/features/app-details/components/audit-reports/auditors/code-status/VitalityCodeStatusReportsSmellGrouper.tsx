import * as React from 'react';
import { useEffect, useState } from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { Card, Checkbox, Col, DynamicLoader, Row } from '@v6y/ui-kit';

import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityModuleList = DynamicLoader(
    () => import('../../../../../../commons/components/modules/VitalityModuleList'),
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
            <VitalityModuleList modules={selectedReports as VitalityModuleType[]} source="smells" />
        </>
    );
};

export default VitalityCodeStatusReportsSmellGrouper;
