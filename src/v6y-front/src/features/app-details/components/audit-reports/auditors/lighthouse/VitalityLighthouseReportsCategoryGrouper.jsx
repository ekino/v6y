import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Statistic, Typography } from 'antd';
import dynamic from 'next/dynamic.js';
import Link from 'next/link.js';
import React, { useState } from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader.jsx';
import { AUDIT_STATUS_COLORS } from '../../../../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms.js';
import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper.jsx';

const VitalityAuditReportsHelpView = dynamic(
    () => import('../help/VitalityAuditReportsHelpView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityLighthouseReportsCategoryGrouper = ({ reports }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const { groupedDataSource } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    return (
        <>
            <Descriptions
                bordered
                size="middle"
                column={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 2,
                    xxl: 2,
                }}
                extra={
                    <Button icon={<InfoCircleOutlined />} onClick={() => setIsHelpModalOpen(true)}>
                        <Typography.Text>
                            {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_LABEL}
                        </Typography.Text>
                    </Button>
                }
            >
                {Object.keys(groupedDataSource || {}).map((category) => {
                    const report = groupedDataSource[category][0];
                    return (
                        <Descriptions.Item
                            key={`${report.type}-${report.category}-${report.subCategory}`}
                            label={
                                <Typography.Text>{`${report.type} (${report.category})`}</Typography.Text>
                            }
                        >
                            <>
                                <Statistic
                                    value={report.score || 0}
                                    suffix={report.scoreUnit || ''}
                                    valueStyle={{
                                        color: AUDIT_STATUS_COLORS[report.status?.toLowerCase()],
                                    }}
                                />
                                {report.module?.url?.length && (
                                    <Link href={report.module?.url} target="_blank">
                                        <Typography.Text style={{ textDecoration: 'underline' }}>
                                            {
                                                VitalityTerms.VITALITY_APP_DETAILS_AUDIT_OPEN_APP_LABEL
                                            }
                                        </Typography.Text>
                                    </Link>
                                )}
                            </>
                        </Descriptions.Item>
                    );
                })}
            </Descriptions>
            <VitalityAuditReportsHelpView
                isOpen={isHelpModalOpen}
                reports={reports}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </>
    );
};

export default VitalityLighthouseReportsCategoryGrouper;
