import * as React from 'react';

import { auditStatus } from '@v6y/core-logic/src/config/AuditHelpConfig';
import {
    Avatar,
    Button,
    Card,
    Divider,
    EmptyView,
    InfoCircleOutlined,
    ListItem,
    ListItemMeta,
    PushpinOutlined,
    Space,
    Statistic,
    TextView,
    useThemeConfigProvider,
    useTranslationProvider,
} from '@v6y/ui-kit';

import { VitalityModuleType } from '../../types/VitalityModulesProps';

type VitalityModuleItemProps = {
    module: VitalityModuleType;
    onModuleClicked: (module: VitalityModuleType) => void;
};

const VitalityModuleListItem = ({ module, onModuleClicked }: VitalityModuleItemProps) => {
    const { currentConfig } = useThemeConfigProvider();
    const { translate } = useTranslationProvider();
    const patternName =
        module.name || module.label || `${module.type ? `${module.type}-` : ''}${module.category}`;
    const moduleScore = module.score ? `${module.score || 0} ${module.scoreUnit || ''}` : '';
    const hasAuditHelp = Object.keys(module.auditHelp || {}).length > 0;
    const hasDependencyStatusHelp = Object.keys(module.statusHelp || {}).length > 0;
    const hasEvolutionHelp = Object.keys(module.evolutionHelp || {}).length > 0;
    const modulePath = module?.path?.replaceAll(' -> []', '');
    const qualityMetricStatus = currentConfig?.status || {};
    const qualityMetricStatusIcons = currentConfig?.statusIcons || {};

    return (
        <ListItem>
            <ListItemMeta
                title={
                    <Space direction="horizontal" size="middle">
                        {patternName}
                        {(hasAuditHelp || hasDependencyStatusHelp || hasEvolutionHelp) && (
                            <Button
                                type="text"
                                icon={<InfoCircleOutlined />}
                                onClick={() => {
                                    onModuleClicked(module);
                                }}
                            />
                        )}
                    </Space>
                }
                avatar={
                    <Avatar
                        shape="square"
                        size="small"
                        style={{
                            background:
                                qualityMetricStatus[
                                    (module.scoreStatus as keyof typeof qualityMetricStatus) ||
                                        'disabled'
                                ],
                        }}
                        icon={<PushpinOutlined />}
                    />
                }
                description={
                    <Card bordered={false}>
                        <Space direction="vertical" size="small">
                            {module?.auditStatus === auditStatus.failure ? (
                                <EmptyView
                                    message={translate(
                                        'vitality.appDetailsPage.audit.statusFailure',
                                    )}
                                />
                            ) : (
                                moduleScore?.length > 0 && (
                                    <Statistic
                                        title={`${translate('vitality.appDetailsPage.audit.indicatorScore')}: `}
                                        value={module.score || 0}
                                        suffix={module.scoreUnit || ''}
                                        valueStyle={{
                                            color: qualityMetricStatus[
                                                (module.scoreStatus as keyof typeof qualityMetricStatus) ||
                                                    'default'
                                            ],
                                        }}
                                        prefix={
                                            qualityMetricStatusIcons[
                                                (module.scoreStatus as keyof typeof qualityMetricStatusIcons) ||
                                                    'default'
                                            ]
                                        }
                                    />
                                )
                            )}
                            {(module.branch?.length || 0) > 0 && (
                                <>
                                    <TextView
                                        content={`${translate('vitality.appDetailsPage.audit.detectOnBranch')}: `}
                                    />
                                    <TextView content={module.branch} />
                                </>
                            )}
                            {(modulePath?.length || 0) > 0 && (
                                <>
                                    <TextView
                                        content={`${translate('vitality.appDetailsPage.audit.detectOnPath')}: `}
                                    />
                                    <TextView content={modulePath} />
                                </>
                            )}
                        </Space>
                    </Card>
                }
            />
            <Divider dashed />
        </ListItem>
    );
};

export default VitalityModuleListItem;
