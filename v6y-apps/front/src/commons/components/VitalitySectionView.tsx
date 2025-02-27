import {
    Avatar,
    Button,
    Card,
    Col,
    EmptyView,
    ExportOutlined,
    LoaderView,
    Paragraph,
    Row,
    Space,
    TitleView,
} from '@v6y/ui-kit';
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
    <Row justify="center" align="middle" gutter={[0, 24]}>
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
                        {avatar && <Avatar size={32} icon={avatar} />}
                        <TitleView title={title || ''} level={3} />
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
                {isLoading ? <LoaderView /> : <>{isEmpty ? <EmptyView /> : children}</>}
            </Card>
        </Col>
    </Row>
);

export default VitalitySectionView;
