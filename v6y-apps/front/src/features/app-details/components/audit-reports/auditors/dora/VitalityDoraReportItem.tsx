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
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

type VitalityDoraReportItemProps = {
    report: AuditType;
    onOpenHelpClicked: (helpDetails: VitalityModuleType) => void;
};

const VitalityDoraReportItem = ({ report, onOpenHelpClicked }: VitalityDoraReportItemProps) => {
    const { currentConfig } = useThemeConfigProvider();
    const qualityMetricStatus = currentConfig?.status || {};
    const qualityMetricStatusIcons = currentConfig?.statusIcons || {};
    const { translate } = useTranslationProvider();

    return (
        <Card
            key={`${report.type}-${report.category}`}
            title={<TitleView level={4} title={report.category as string} />}
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
                                content={`${translate('vitality.appDetailsPage.audit.helpCategory')}: ${report.category}`}
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
                    </Row>
                }
            />
        </Card>
    );
};

export default VitalityDoraReportItem;
