import { AuditType } from '@v6y/core-logic/src/types';
import {
    Button,
    Card,
    Col,
    InfoCircleOutlined,
    List,
    Row,
    Statistic,
    VitalityModal,
    VitalityText,
    VitalityTitle,
    useThemeConfigProvider,
} from '@v6y/shared-ui';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityDynamicLoader from '../../../../../../commons/components/VitalityDynamicLoader';
import VitalityPaginatedList from '../../../../../../commons/components/VitalityPaginatedList';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms';
import useDataGrouper from '../../../../../../commons/hooks/useDataGrouper';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityHelpView = VitalityDynamicLoader(
    () => import('../../../../../../commons/components/help/VitalityHelpView'),
);

const VitalityLighthouseReportsCategoryGrouper = ({ reports }: { reports: AuditType[] }) => {
    const { currentConfig } = useThemeConfigProvider();
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

    const qualityMetricStatus = currentConfig?.status || {};
    const qualityMetricStatusIcons = currentConfig?.statusIcons || {};

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
                                title={<VitalityTitle level={4} title={report.type as string} />}
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
                                                <VitalityText
                                                    text={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL}: ${report.category}`}
                                                />
                                            </Col>
                                            <Col span={22} style={{ textAlign: 'center' }}>
                                                <Statistic
                                                    value={report.score || 0}
                                                    suffix={report.scoreUnit || ''}
                                                    valueStyle={{
                                                        color: qualityMetricStatus[
                                                            (report.status as keyof typeof qualityMetricStatus) ||
                                                                'default'
                                                        ],
                                                    }}
                                                    prefix={
                                                        qualityMetricStatusIcons[
                                                            (report.status as keyof typeof qualityMetricStatusIcons) ||
                                                                'default'
                                                        ]
                                                    }
                                                />
                                            </Col>
                                            {report.module?.url?.length && (
                                                <Col span={22} style={{ textAlign: 'right' }}>
                                                    <Link href={report.module?.url} target="_blank">
                                                        <VitalityText
                                                            text={
                                                                VitalityTerms.VITALITY_APP_DETAILS_AUDIT_OPEN_APP_LABEL
                                                            }
                                                            underline
                                                        />
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
                    <VitalityTitle
                        title={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_MODULE_HELP_TITLE}
                        level={5}
                    />
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
