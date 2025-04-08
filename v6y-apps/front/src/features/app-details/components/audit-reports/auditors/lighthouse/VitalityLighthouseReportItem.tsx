import { AuditType } from '@v6y/core-logic/src/types';
import {
    Button,
    Card,
    Col,
    InfoCircleOutlined,
    Row,
    Statistic,
    TextView,
    TitleView,
    useThemeConfigProvider,
} from '@v6y/ui-kit';
import Link from 'next/link';
import * as React from 'react';

import VitalityTerms from '../../../../../../commons/config/VitalityTerms';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

type VitalityLighthouseReportItemProps = {
    report: AuditType;
    onOpenHelpClicked: (helpDetails: VitalityModuleType) => void;
};

const VitalityLighthouseReportItem = ({
    report,
    onOpenHelpClicked,
}: VitalityLighthouseReportItemProps) => {
    const { currentConfig } = useThemeConfigProvider();

    const qualityMetricStatus = currentConfig?.status || {};
    const qualityMetricStatusIcons = currentConfig?.statusIcons || {};

    return (
        <Card
            key={`${report.type}-${report.category}-${report.subCategory}`}
            title={<TitleView level={4} title={report.type as string} />}
            actions={[
                <Button
                    key="help-button"
                    data-testid="help-button"
                    icon={<InfoCircleOutlined />}
                    type="text"
                    onClick={() => onOpenHelpClicked(report as VitalityModuleType)}
                />,
            ]}
        >
            <Card.Meta
                description={
                    <Row gutter={[16, 16]} justify="center" align="middle">
                        <Col span={22}>
                            <TextView
                                content={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL}: ${report.category}`}
                            />
                        </Col>
                        <Col span={22}>
                            <Statistic
                                value={report.score || 0}
                                suffix={report.scoreUnit || ''}
                                valueStyle={{
                                    color: qualityMetricStatus[
                                        (report.scoreStatus as keyof typeof qualityMetricStatus) ||
                                            'default'
                                    ],
                                }}
                                prefix={
                                    qualityMetricStatusIcons[
                                        (report.scoreStatus as keyof typeof qualityMetricStatusIcons) ||
                                            'default'
                                    ]
                                }
                            />
                        </Col>
                        {report.module?.url?.length && (
                            <Col span={22}>
                                <Link href={report.module?.url} target="_blank">
                                    <TextView
                                        content={
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
    );
};

export default VitalityLighthouseReportItem;
