import {
    Avatar,
    Button,
    Card,
    Divider,
    InfoCircleOutlined,
    List,
    PushpinOutlined,
    Space,
    Statistic,
    VitalityModal,
    VitalityText,
    VitalityTitle,
    useThemeConfigProvider,
} from '@v6y/shared-ui';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityTerms from '../../config/VitalityTerms';
import { VitalityModuleType, VitalityModulesProps } from '../../types/VitalityModulesProps';
import VitalityDynamicLoader from '../VitalityDynamicLoader';
import VitalityPaginatedList from '../VitalityPaginatedList';

const VitalityHelpView = VitalityDynamicLoader(() => import('../help/VitalityHelpView'));

const VitalityModulesView = ({ modules }: VitalityModulesProps) => {
    const { currentConfig } = useThemeConfigProvider();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState<VitalityModuleType>();

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
                dataSource={modules}
                renderItem={(item: unknown) => {
                    const itemModule = item as VitalityModuleType;
                    const patternName =
                        itemModule.name ||
                        itemModule.label ||
                        `${itemModule.type ? `${itemModule.type}-` : ''}${itemModule.category}`;
                    const moduleScore = itemModule.score
                        ? `${itemModule.score || 0} ${itemModule.scoreUnit || ''}`
                        : '';
                    const hasAuditHelp = Object.keys(itemModule.auditHelp || {}).length > 0;
                    const hasDependencyStatusHelp =
                        Object.keys(itemModule.statusHelp || {}).length > 0;
                    const hasEvolutionHelp = Object.keys(itemModule.evolutionHelp || {}).length > 0;
                    const modulePath = itemModule?.path?.replaceAll(' -> []', '');

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <Space direction="horizontal" size="middle">
                                        {patternName}
                                        {(hasAuditHelp ||
                                            hasDependencyStatusHelp ||
                                            hasEvolutionHelp) && (
                                            <Button
                                                type="text"
                                                icon={<InfoCircleOutlined />}
                                                onClick={() => {
                                                    setHelpDetails(itemModule);
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
                                                    (itemModule.status as keyof typeof qualityMetricStatus) ||
                                                        'default'
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
                                                    value={itemModule.score || 0}
                                                    suffix={itemModule.scoreUnit || ''}
                                                    valueStyle={{
                                                        color: qualityMetricStatus[
                                                            (itemModule.status as keyof typeof qualityMetricStatus) ||
                                                                'default'
                                                        ],
                                                    }}
                                                    prefix={
                                                        qualityMetricStatusIcons[
                                                            (itemModule.status as keyof typeof qualityMetricStatusIcons) ||
                                                                'default'
                                                        ]
                                                    }
                                                />
                                            )}
                                            {(itemModule.branch?.length || 0) > 0 && (
                                                <>
                                                    <VitalityText
                                                        style={{ fontWeight: 'bold' }}
                                                        text={`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCH_LABEL}: `}
                                                    />
                                                    <VitalityText
                                                        style={{ fontWeight: 'normal' }}
                                                        text={itemModule.branch}
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
                {helpDetails && <VitalityHelpView module={helpDetails} />}
            </VitalityModal>
        </>
    );
};

export default VitalityModulesView;
