import { ExportOutlined } from '@ant-design/icons';
import * as React from 'react';

import Avatar from '@v6y/ui-kit/components/atoms/app/Avatar.tsx';
import Button from '@v6y/ui-kit/components/atoms/app/Button.tsx';
import Card from '@v6y/ui-kit/components/atoms/app/Card.tsx';
import { Col } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import { Row } from '@v6y/ui-kit/components/atoms/app/Grid.tsx';
import Space from '@v6y/ui-kit/components/atoms/app/Space.tsx';
import EmptyView from '@v6y/ui-kit/components/organisms/app/EmptyView.tsx';
import LoaderView from '@v6y/ui-kit/components/organisms/app/LoaderView.tsx';
import Paragraph from '@v6y/ui-kit/components/organisms/app/Paragraph.tsx';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView.tsx';

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
                    <Card.Meta description={<Paragraph content={<p>{description || ''}</p>} />} />
                )}
                {isLoading ? <LoaderView /> : <>{isEmpty ? <EmptyView /> : children}</>}
            </Card>
        </Col>
    </Row>
);

export default VitalitySectionView;
