import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types/AuditType';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';
import Button from '@v6y/ui-kit/components/atoms/app/Button.tsx';
import Card from '@v6y/ui-kit/components/atoms/app/Card.tsx';
import { Col } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import { Row } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import Statistic from '@v6y/ui-kit/components/atoms/app/Statistic.tsx';
import TextView from '@v6y/ui-kit/components/organisms/app/TextView.tsx';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView.tsx';
import { useThemeConfigProvider } from '@v6y/ui-kit/hooks/useThemeConfigProvider.tsx';

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

    const { translate } = useTranslationProvider();

    return (
        <Card
            key={`${report.type}-${report.category}-${report.subCategory}`}
            title={<TitleView level={4} title={report.type as string} />}
            actions={[
                <Button
                    key="help-button"
                    data-testid="help-button"
                    icon={<InfoCircledIcon />}
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
                        {report.module?.url?.length && (
                            <Col span={22}>
                                <Link href={report.module?.url} target="_blank">
                                    <TextView
                                        content={translate('vitality.appDetailsPage.audit.openApp')}
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
