import { Descriptions, List, Tag, Typography } from 'antd';
import React from 'react';

import VitalityGridList from '../../../../commons/components/VitalityGridList.jsx';
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
                            color={EVOLUTIONS_STATUS_INFOS[evolution.status]?.statusColor}
                            style={{
                                backgroundColor: 'white',
                            }}
                        >
                            {EVOLUTIONS_STATUS_INFOS[evolution.status]?.statusLabel}
                        </Tag>
                    }
                >
                    <Typography.Text>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: evolution.description.split('. ').join('. <br />'),
                            }}
                        />
                    </Typography.Text>
                </Descriptions.Item>
            )}

            {evolution.modules?.length > 0 && (
                <Descriptions.Item label="Detected on module (branch)">
                    <VitalityGridList
                        bordered={false}
                        dataSource={evolution.modules}
                        renderItem={(module, index) => (
                            <List.Item key={`Tag-${module.branch}-${module.module}-${index}`}>
                                <Typography.Text>{`${module.module} (${module.branch})`}</Typography.Text>
                            </List.Item>
                        )}
                    />
                </Descriptions.Item>
            )}

            {evolution?.links?.length > 0 && (
                <Descriptions.Item label="Helpful links">
                    <VitalityLinks align="center" links={evolution?.links} />
                </Descriptions.Item>
            )}
        </Descriptions>
    </List.Item>
);

export default VitalityAppDetailsEvolutionListItem;
