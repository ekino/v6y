import { Col, Row, Tag, Typography } from 'antd';

const VitalityTags = ({ tags, align }) => (
    <Row wrap gutter={[16, 16]} justify={align || 'end'} align="middle">
        {tags?.map((tag) => (
            <Col
                key={`${tag._id}${tag.label}${tag.branch?.length ? ` - Branch: ${tag.branch}` : ''}`}
            >
                <Tag bordered color={tag.color} style={{ backgroundColor: 'white' }}>
                    {`${tag.label}${tag.branch?.length ? ` - (branch: ${tag.branch})` : ''}`}
                </Tag>
            </Col>
        ))}
    </Row>
);

export default VitalityTags;
