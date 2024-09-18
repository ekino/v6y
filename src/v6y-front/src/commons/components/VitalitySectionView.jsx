import { Avatar, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';

import VitalityEmptyView from './VitalityEmptyView.jsx';
import VitalityLoader from './VitalityLoader.jsx';

const VitalitySectionView = ({ isLoading, isEmpty, title, description, avatar, children }) => (
    <Row
        justify="center"
        align="middle"
        gutter={[0, 24]}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
    >
        <Col span={22}>
            <Card
                bordered
                title={
                    <Space split size="small" align="baseline">
                        {avatar && (
                            <Avatar
                                size={32}
                                icon={avatar}
                                style={{
                                    marginTop: '-1rem',
                                }}
                            />
                        )}
                        <Typography.Title level={3}>{title || ''}</Typography.Title>
                    </Space>
                }
            >
                {description?.length > 0 && (
                    <Card.Meta
                        description={
                            <Typography.Paragraph>
                                <p>{description || ''}</p>
                            </Typography.Paragraph>
                        }
                    />
                )}
                {isLoading ? <VitalityLoader /> : <>{isEmpty ? <VitalityEmptyView /> : children}</>}
            </Card>
        </Col>
    </Row>
);

export default VitalitySectionView;
