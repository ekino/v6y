import {
    Avatar,
    Button,
    Card,
    Col,
    ExportOutlined,
    Paragraph,
    Row,
    Space,
    VitalityEmptyView,
    VitalityLoader,
    VitalityTitle,
} from '@v6y/shared-ui';
import * as React from 'react';

import { VitalitySectionViewProps } from '../types/VitalitySectionViewProps';

const VitalitySectionView = ({
    isLoading,
    isEmpty,
    title,
    description,
    avatar,
    children,
    exportButtonLabel,
    onExportClicked,
}: VitalitySectionViewProps) => (
    <Row
        justify="center"
        align="middle"
        gutter={[0, 24]}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
    >
        <Col span={20}>
            <Card
                bordered
                extra={
                    onExportClicked ? (
                        <Button type="text" icon={<ExportOutlined />} onClick={onExportClicked}>
                            {exportButtonLabel}
                        </Button>
                    ) : null
                }
                title={
                    <Space split size="small" align="baseline">
                        {avatar && (
                            <Avatar
                                size={32}
                                icon={avatar}
                                style={{
                                    marginTop: '-1rem',
                                    backgroundColor: '#1a1a1a',
                                }}
                            />
                        )}
                        <VitalityTitle title={title || ''} level={3} />
                    </Space>
                }
            >
                {(description?.length || 0) > 0 && (
                    <Card.Meta
                        description={
                            <Paragraph>
                                <p>{description || ''}</p>
                            </Paragraph>
                        }
                    />
                )}
                {isLoading ? <VitalityLoader /> : <>{isEmpty ? <VitalityEmptyView /> : children}</>}
            </Card>
        </Col>
    </Row>
);

export default VitalitySectionView;
