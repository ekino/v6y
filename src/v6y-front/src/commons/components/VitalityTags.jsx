import { Col, Row, Tag } from 'antd';

const VitalityTags = ({ tags }) => (
    <Row wrap gutter={[16, 16]} justify="end" align="middle">
        {tags?.map((tag) => (
            <Col key={tag._id}>
                <Tag color={tag.color}>{`${tag.label} (${tag.branch} - ${tag.type})`}</Tag>
            </Col>
        ))}
    </Row>
);

export default VitalityTags;
