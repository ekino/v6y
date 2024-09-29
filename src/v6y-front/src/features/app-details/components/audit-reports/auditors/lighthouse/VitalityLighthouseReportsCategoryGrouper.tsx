import { InfoCircleOutlined } from '@ant-design/icons';
import { AuditType } from '@v6y/commons';
import { Button, Card, Col, List, Row, Statistic, Typography } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader';
import VitalityModal from '../../../../../../commons/components/VitalityModal';
import VitalityPaginatedList from '../../../../../../commons/components/VitalityPaginatedList';
import {
    QUALITY_METRIC_ICONS,
    QUALITY_METRIC_STATUS,
} from '../../../../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms';
import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityHelpView = dynamic(
    () => import('../../../../../../commons/components/help/VitalityHelpView'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityLighthouseReportsCategoryGrouper = ({ reports }: { reports: AuditType[] }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState<VitalityModuleType>();

    const { groupedDataSource } = useDataGrouper({
        dataSource: reports,
        criteria: 'category',
        hasAllGroup: false,
    });

    useEffect(() => {
        if (Object.keys(helpDetails || {})?.length > 0) {
            setIsHelpModalOpen(true);
        } else {
            setIsHelpModalOpen(false);
        }
    }, [helpDetails]);

    return (
        <>
            <VitalityPaginatedList
                style={{ paddingTop: '2rem', marginTop: '2rem' }}
                pageSize={15}
                grid={{ gutter: 4, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
                dataSource={Object.keys(groupedDataSource || {})}
                renderItem={(item) => {
                    const report = groupedDataSource[item as string][0] as AuditType;
                    return (
                        <List.Item>
                            <Card
                                key={`${report.type}-${report.category}-${report.subCategory}`}
                                title={<Typography.Title level={4}>{report.type}</Typography.Title>}
                                actions={[
                                    <Button
                                        key="help-button"
                                        icon={<InfoCircleOutlined />}
                                        type="text"
                                        onClick={() => setHelpDetails(report as VitalityModuleType)}
                                    />,
                                ]}
                            >
                                <Card.Meta
                                    description={
                                        <Row gutter={[16, 16]} justify="center" align="middle">
                                            <Col span={22} style={{ textAlign: 'left' }}>
                                                <Typography.Text>
                                                    {`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL}: ${report.category}`}
                                                </Typography.Text>
                                            </Col>
                                            <Col span={22} style={{ textAlign: 'center' }}>
                                                <Statistic
                                                    value={report.score || 0}
                                                    suffix={report.scoreUnit || ''}
                                                    valueStyle={{
                                                        color: QUALITY_METRIC_STATUS[
                                                            (report.status as keyof typeof QUALITY_METRIC_STATUS) ||
                                                                'default'
                                                        ],
                                                    }}
                                                    prefix={
                                                        QUALITY_METRIC_ICONS[
                                                            (report.status as keyof typeof QUALITY_METRIC_ICONS) ||
                                                                'default'
                                                        ]
                                                    }
                                                />
                                            </Col>
                                            {report.module?.url?.length && (
                                                <Col span={22} style={{ textAlign: 'right' }}>
                                                    <Link href={report.module?.url} target="_blank">
                                                        <Typography.Text
                                                            style={{ textDecoration: 'underline' }}
                                                        >
                                                            {
                                                                VitalityTerms.VITALITY_APP_DETAILS_AUDIT_OPEN_APP_LABEL
                                                            }
                                                        </Typography.Text>
                                                    </Link>
                                                </Col>
                                            )}
                                        </Row>
                                    }
                                />
                            </Card>
                        </List.Item>
                    );
                }}
            />
            <VitalityModal
                title={
                    <Typography.Title level={5}>
                        {VitalityTerms.VITALITY_APP_DETAILS_AUDIT_MODULE_HELP_TITLE}
                    </Typography.Title>
                }
                onCloseModal={() => setHelpDetails(undefined)}
                isOpen={isHelpModalOpen}
            >
                <VitalityHelpView module={helpDetails as VitalityModuleType} />
            </VitalityModal>
        </>
    );
};

export default VitalityLighthouseReportsCategoryGrouper;
