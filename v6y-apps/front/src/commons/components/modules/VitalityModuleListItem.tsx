import {
    Avatar,
    Button,
    Card,
    Divider,
    InfoCircleOutlined,
    ListItem,
    ListItemMeta,
    PushpinOutlined,
    Space,
    Statistic,
    VitalityText,
    useThemeConfigProvider,
} from '@v6y/shared-ui';
import * as React from 'react';

import VitalityTerms from '../../config/VitalityTerms';
import { VitalityModuleType } from '../../types/VitalityModulesProps';

type VitalityModuleItemProps = {
    module: VitalityModuleType;
    onModuleClicked: (module: VitalityModuleType) => void;
};

const VitalityModuleListItem = ({ module, onModuleClicked }: VitalityModuleItemProps) => {
    const { currentConfig } = useThemeConfigProvider();
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
                                    (module.status as keyof typeof qualityMetricStatus) || 'default'
                                ],
                        }}
                        icon={<PushpinOutlined />}
                    />
                }
                description={
                    <Card bordered={false}>
                        <Space direction="vertical" size="small">
                            {moduleScore?.length > 0 && (
                                <Statistic
                                    title={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_INDICATOR_SCORE_LABEL}: `}
                                    value={module.score || 0}
                                    suffix={module.scoreUnit || ''}
                                    valueStyle={{
                                        color: qualityMetricStatus[
                                            (module.status as keyof typeof qualityMetricStatus) ||
                                                'default'
                                        ],
                                    }}
                                    prefix={
                                        qualityMetricStatusIcons[
                                            (module.status as keyof typeof qualityMetricStatusIcons) ||
                                                'default'
                                        ]
                                    }
                                />
                            )}
                            {(module.branch?.length || 0) > 0 && (
                                <>
                                    <VitalityText
                                        style={{ fontWeight: 'bold' }}
                                        text={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCH_LABEL}: `}
                                    />
                                    <VitalityText
                                        style={{ fontWeight: 'normal' }}
                                        text={module.branch}
                                    />
                                </>
                            )}
                            {(modulePath?.length || 0) > 0 && (
                                <>
                                    <VitalityText
                                        style={{ fontWeight: 'bold' }}
                                        text={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_PATH_LABEL}: `}
                                    />
                                    <VitalityText
                                        style={{ fontWeight: 'normal' }}
                                        text={modulePath}
                                    />
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
