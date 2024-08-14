import { Col, List, Row, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

import VitalityTags from '../../../commons/components/VitalityTags.jsx';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';

const VitalityAppListItem = ({ app }) => {
    return (
        <List.Item key={app._id}>
            <Row style={{ width: '100%' }} gutter={[12, 12]} justify="center" align="middle">
                <Col span={24}>
                    <Typography.Title level={4}>{app.name}</Typography.Title>
                </Col>
                <Col span={24}>
                    <Typography.Text>{app.description}</Typography.Text>
                </Col>
                <Col span={24}>
                    <VitalityTags align="center" tags={app.keywords} />
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Link href={`app-details?appId=${app._id}`}>
                        <Typography.Text underline>
                            {VitalityTerms.VITALITY_APP_LIST_OPEN_DETAILS_LABEL}
                        </Typography.Text>
                    </Link>
                </Col>
            </Row>
        </List.Item>
    );
};

export default VitalityAppListItem;
