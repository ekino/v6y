import { InfoCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Drawer, List, Space, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { QUALITY_METRIC_ICONS, QUALITY_METRIC_STATUS } from '../../config/VitalityCommonConfig.js';
import VitalityTerms from '../../config/VitalityTerms.js';
import VitalityPaginatedList from '../VitalityPaginatedList.jsx';

const VitalityModulesView = ({ modules, source, status }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpDetails, setHelpDetails] = useState({});

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
                dataSource={modules}
                renderItem={(module) => {
                    const patternName =
                        module.name ||
                        module.label ||
                        `${module.type ? `${module.type}-` : ''}${module.category}`;
                    const pathComponents = module.path?.split('/') || [];
                    const pathLabel = `${pathComponents[pathComponents.length - 2]}/${pathComponents[pathComponents.length - 1]}`;
                    const moduleScore = module.score
                        ? `${module.score || 0} ${module.scoreUnit || ''}`
                        : '';

                    console.log({
                        status: module.status,
                    });
                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <Space direction="horizontal" size="middle">
                                        {patternName}
                                        <Button
                                            type="text"
                                            icon={<InfoCircleOutlined />}
                                            onClick={() => {
                                                setHelpDetails(module);
                                            }}
                                        />
                                    </Space>
                                }
                                avatar={
                                    <Avatar
                                        shape="square"
                                        size="small"
                                        style={{
                                            background:
                                                QUALITY_METRIC_STATUS[module.status || 'default'],
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
                                                        color: QUALITY_METRIC_STATUS[
                                                            module.status || 'default'
                                                        ],
                                                    }}
                                                    prefix={
                                                        QUALITY_METRIC_ICONS[
                                                            module.status || 'default'
                                                        ]
                                                    }
                                                />
                                            )}
                                            {module.branch?.length > 0 && (
                                                <Typography.Text style={{ fontWeight: 'bold' }}>
                                                    {`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCHES_LABEL}: `}
                                                    <Typography.Text
                                                        style={{ fontWeight: 'normal' }}
                                                    >
                                                        {module.branch}
                                                    </Typography.Text>
                                                </Typography.Text>
                                            )}
                                            {pathComponents?.length > 0 && (
                                                <Typography.Text style={{ fontWeight: 'bold' }}>
                                                    {`${VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_PATHS_LABEL}: `}
                                                    <Typography.Text
                                                        style={{ fontWeight: 'normal' }}
                                                    >
                                                        {pathLabel}
                                                    </Typography.Text>
                                                </Typography.Text>
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
            <Drawer
                size="large"
                title={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_MODULE_HELP_TITLE}
                onClose={() => setHelpDetails({})}
                open={isHelpModalOpen}
            >
                sss
            </Drawer>
        </>
    );
};

export default VitalityModulesView;
