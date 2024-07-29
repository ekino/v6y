import { Col, List, Row, Typography } from 'antd';
import VitalityTags from '../../commons/components/VitalityTags.jsx';
import CommonsDico from '../../commons/dico/CommonsDico.js';
import Link from 'next/link';
import React from 'react';

const VitalityAppListItem = ({ app }) => {
    return (
        <List.Item key={app._id}>
            <Row style={{ width: '100%' }} gutter={[12, 12]} justify="center" align="middle">
                <Col span={24}>
                    <Typography.Title level={3}>{app.name}</Typography.Title>
                </Col>
                <Col span={24}>
                    <Typography.Text>{app.description}</Typography.Text>
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <VitalityTags tags={app.keywords} />
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Link href={`app-details?app=${app._id}`}>
                        <Typography.Text underline>
                            {CommonsDico.VITALITY_APP_LIST_OPEN_DETAILS_LABEL}
                        </Typography.Text>
                    </Link>
                </Col>
            </Row>
        </List.Item>
    );
};

export default VitalityAppListItem;
