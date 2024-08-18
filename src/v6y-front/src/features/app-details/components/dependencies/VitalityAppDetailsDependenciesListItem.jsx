import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, List, Space, Tag, Typography } from 'antd';
import Link from 'next/link.js';
import React, { useState } from 'react';

import VitalityLinks from '../../../../commons/components/VitalityLinks.jsx';
import VitalityModal from '../../../../commons/components/VitalityModal.jsx';
import { normalizeDependencyVersion } from '../../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';

const VitalityAppDetailsDependenciesListItem = ({ dependency }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const dependencyStatusInfos =
        VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_STATUS_INFOS[dependency.status];
    return (
        <List.Item>
            <Descriptions
                bordered
                style={{ marginTop: '1rem' }}
                title={
                    <Typography.Title level={4}>
                        {dependency.name}
                        <Tag
                            key={`Status: ${dependency.name} - ${dependency.usedOnPath} - ${dependency.branch}`}
                            bordered
                            color={dependencyStatusInfos.color}
                            style={{
                                marginLeft: '1rem',
                                backgroundColor: 'white',
                            }}
                        >
                            {dependencyStatusInfos.label}
                        </Tag>
                    </Typography.Title>
                }
                layout="vertical"
                extra={
                    <>
                        <Link
                            key={`Url: ${dependency.name} - ${dependency.usedOnPath} - ${dependency.branch}`}
                            href={dependency.usedOnUrl}
                            target="_blank"
                            style={{ textDecoration: 'none', marginRight: '1rem' }}
                        >
                            <Typography.Text style={{ textDecoration: 'underline' }}>
                                {VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_OPEN_MODULE_LABEL}
                            </Typography.Text>
                        </Link>
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={() => setIsHelpModalOpen(true)}
                        >
                            <Typography.Text>
                                {VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_HELP_LABEL}
                            </Typography.Text>
                        </Button>
                    </>
                }
            >
                {dependency.branch && (
                    <Descriptions.Item label="Branch">{dependency.branch}</Descriptions.Item>
                )}
                <Descriptions.Item label="Current Version">
                    {normalizeDependencyVersion(dependency.version)}
                </Descriptions.Item>
                <Descriptions.Item label="Recommended Version">
                    {normalizeDependencyVersion(dependency.recommendedVersion)}
                </Descriptions.Item>
            </Descriptions>
            <VitalityModal
                title={
                    <Typography.Title level={5}>
                        {dependency.help?.title ||
                            VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_HELP_TITLE}
                    </Typography.Title>
                }
                isOpen={isHelpModalOpen}
                onCloseModal={() => setIsHelpModalOpen(false)}
            >
                <Space size="middle" direction="vertical">
                    <Typography.Text>
                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    dependency.help?.description?.split('. ')?.join('. <br />') ||
                                    VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_HELP_DESCRIPTION,
                            }}
                        />
                    </Typography.Text>
                    <VitalityLinks align="center" links={dependency.help?.docLinks} />
                </Space>
            </VitalityModal>
        </List.Item>
    );
};

export default VitalityAppDetailsDependenciesListItem;
