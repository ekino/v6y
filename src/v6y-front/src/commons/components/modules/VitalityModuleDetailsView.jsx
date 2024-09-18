import { PushpinOutlined } from '@ant-design/icons';
import { Avatar, List, Typography } from 'antd';
import React from 'react';

import { QUALITY_METRIC_STATUS } from '../../config/VitalityCommonConfig.js';
import VitalityPaginatedList from '../VitalityPaginatedList.jsx';

const VitalityModuleDetailsView = ({ moduleDetails, header }) => {
    return (
        <VitalityPaginatedList
            header={header}
            dataSource={moduleDetails || []}
            renderItem={(value) => (
                <List.Item>
                    <List.Item.Meta
                        title={<Typography.Text strong>{value?.split('XXX')?.[0]}</Typography.Text>}
                        avatar={
                            <Avatar
                                shape="square"
                                size="small"
                                style={{
                                    background:
                                        QUALITY_METRIC_STATUS[
                                            value?.split('XXX')?.[1] || 'default'
                                        ],
                                }}
                                icon={<PushpinOutlined />}
                            />
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default VitalityModuleDetailsView;
