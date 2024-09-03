import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';

const MAX_TAGS = 5;

const VitalityTags = ({ tags, align }) => {
    const [dataSource, setDataSource] = useState(null);
    const [collapse, setCollapse] = useState(true);

    useEffect(() => {
        if (tags?.length > MAX_TAGS) {
            setCollapse(true);
        }
    }, [tags]);

    useEffect(() => {
        if (collapse) {
            setDataSource(tags?.slice(0, MAX_TAGS));
        } else {
            setDataSource(tags);
        }
    }, [collapse]);

    return (
        <Row wrap gutter={[16, 16]} justify={align || 'end'} align="middle">
            {dataSource?.map((tag) => (
                <Col
                    key={`${tag._id}${tag.label}${tag.branch?.length ? ` - Branch: ${tag.branch}` : ''}`}
                >
                    <Tag bordered color={tag.status}>
                        {`${tag.label}${tag.branch?.length ? ` - (branch: ${tag.branch})` : ''}`}
                    </Tag>
                </Col>
            ))}

            <Col>
                {tags?.length > MAX_TAGS && (
                    <Button
                        type="primary"
                        size="large"
                        iconPosition="end"
                        icon={collapse ? <DownCircleOutlined /> : <UpCircleOutlined />}
                        onClick={() => setCollapse(!collapse)}
                    />
                )}
            </Col>
        </Row>
    );
};

export default VitalityTags;
