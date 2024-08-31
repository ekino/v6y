import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Space, Statistic, Typography } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

import VitalityModal from '../../../../../commons/components/VitalityModal.jsx';
import { AUDIT_STATUS_COLORS } from '../../../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../../../commons/config/VitalityTerms.js';
import VitalityMetricDetailsView from './VitalityMetricDetailsView.jsx';

const VitalityLighthouseReportsView = ({ reports }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <>
            <Descriptions
                bordered
                size="middle"
                column={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                }}
                contentStyle={{
                    textAlign: 'center',
                }}
                extra={
                    <Button icon={<InfoCircleOutlined />} onClick={() => setIsHelpModalOpen(true)}>
                        <Typography.Text>
                            {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_LABEL}
                        </Typography.Text>
                    </Button>
                }
            >
                {reports?.map((report) => (
                    <Descriptions.Item
                        key={`${report.type}-${report.category}-${report.module?.branch}-${report?.auditHelp?.category}-${report.module?.path}`}
                        label={`${report?.auditHelp?.title}${report.subCategory?.length ? ` (${report.subCategory})` : ''}`}
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
                                        {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_OPEN_APP_LABEL}
                                    </Typography.Text>
                                </Link>
                            )}
                        </>
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <VitalityModal
                title={
                    <Typography.Title level={5}>
                        {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_TITLE}
                    </Typography.Title>
                }
                isOpen={isHelpModalOpen}
                onCloseModal={() => setIsHelpModalOpen(false)}
            >
                <Space size="middle" direction="vertical">
                    {reports?.map((metric, index) => (
                        <VitalityMetricDetailsView
                            key={`${metric?.auditHelp?.title}}-${metric?.auditHelp?.description}-${index}`}
                            metric={metric}
                        />
                    ))}
                </Space>
            </VitalityModal>
        </>
    );
};

export default VitalityLighthouseReportsView;
