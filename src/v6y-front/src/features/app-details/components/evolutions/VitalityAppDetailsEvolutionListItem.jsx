import { Descriptions, List, Tag, Typography } from 'antd';
import React from 'react';

import VitalityGridList from '../../../../commons/components/VitalityGridList.jsx';
import VitalityLinks from '../../../../commons/components/VitalityLinks.jsx';
import { EVOLUTIONS_STATUS_INFOS } from '../../../../commons/config/VitalityCommonConfig.js';

const VitalityAppDetailsEvolutionListItem = ({ evolution }) => (
    <List.Item>
        <Descriptions bordered layout="vertical" column={1}>
            {evolution.description?.length > 0 && (
                <Descriptions.Item label="Evolution details">
                    <Typography.Text>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: evolution.description.split('. ').join('. <br />'),
                            }}
                        />
                    </Typography.Text>
                </Descriptions.Item>
            )}
            {evolution.branches?.length > 0 && (
                <Descriptions.Item label="Status by branch">
                    <VitalityGridList
                        bordered
                        dataSource={evolution.branches}
                        renderItem={(branch, index) => (
                            <List.Item>
                                <Tag
                                    key={`Tag-${branch.name}-${branch.status}-${index}`}
                                    bordered
                                    color={EVOLUTIONS_STATUS_INFOS[branch.status]?.statusColor}
                                    style={{
                                        backgroundColor: 'white',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {EVOLUTIONS_STATUS_INFOS[branch.status]?.statusLabel}
                                </Tag>
                                <Typography.Text>{branch.name}</Typography.Text>
                            </List.Item>
                        )}
                    />
                </Descriptions.Item>
            )}
            {evolution?.docLinks?.length > 0 && (
                <Descriptions.Item label="Helpful links">
                    <VitalityLinks align="center" links={evolution?.docLinks} />
                </Descriptions.Item>
            )}
        </Descriptions>
    </List.Item>
);

export default VitalityAppDetailsEvolutionListItem;
