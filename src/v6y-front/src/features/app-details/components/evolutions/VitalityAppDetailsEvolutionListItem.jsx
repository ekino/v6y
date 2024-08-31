import { Descriptions, List, Tag, Typography } from 'antd';
import React from 'react';

import VitalityLinks from '../../../../commons/components/VitalityLinks.jsx';
import { EVOLUTIONS_STATUS_INFOS } from '../../../../commons/config/VitalityCommonConfig.js';

const VitalityAppDetailsEvolutionListItem = ({ evolution }) => (
    <List.Item>
        <Descriptions bordered layout="vertical" column={1}>
            {evolution.description?.length > 0 && (
                <Descriptions.Item
                    label={
                        <Tag
                            bordered
                            color={
                                EVOLUTIONS_STATUS_INFOS[evolution?.evolutionHelp?.status]
                                    ?.statusColor
                            }
                            style={{
                                backgroundColor: 'white',
                            }}
                        >
                            {EVOLUTIONS_STATUS_INFOS[evolution?.evolutionHelp?.status]?.statusLabel}
                        </Tag>
                    }
                >
                    <Typography.Text>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: evolution?.evolutionHelp?.description
                                    .split('. ')
                                    .join('. <br />'),
                            }}
                        />
                    </Typography.Text>
                </Descriptions.Item>
            )}

            {evolution.module?.path?.length && (
                <Descriptions.Item label="Detected on module (branch)">
                    <Typography.Text>{`${evolution.module?.path} (${evolution.module?.branch})`}</Typography.Text>
                </Descriptions.Item>
            )}

            {evolution?.evolutionHelp?.links?.length > 0 && (
                <Descriptions.Item label="Helpful links">
                    <VitalityLinks align="center" links={evolution?.evolutionHelp?.links} />
                </Descriptions.Item>
            )}
        </Descriptions>
    </List.Item>
);

export default VitalityAppDetailsEvolutionListItem;
