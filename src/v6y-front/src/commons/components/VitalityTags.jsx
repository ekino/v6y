import { Col, Row, Tag, Typography } from 'antd';

const VitalityTags = ({ tags }) => (
    <Row wrap gutter={[16, 16]} justify="end" align="middle">
        {tags?.map((tag) => (
            <Col key={tag._id}>
                <Tag color={tag.color}>
                    <Typography.Text>
                        {`${tag.label} (${tag.branch} - ${tag.type})`}
                    </Typography.Text>
                </Tag>
            </Col>
        ))}
    </Row>
);

export default VitalityTags;
