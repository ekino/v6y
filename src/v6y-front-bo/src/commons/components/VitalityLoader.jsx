import { Col, Row, Spin } from 'antd';

const VitalityLoader = () => (
    <Row justify="center" align="middle" gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: 'center' }} />
        <Col span={12} style={{ textAlign: 'center' }}>
            <Spin size="large" />
        </Col>
    </Row>
);

export default VitalityLoader;
