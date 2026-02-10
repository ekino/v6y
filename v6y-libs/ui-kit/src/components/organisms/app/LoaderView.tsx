import { Col, Row } from '../../atoms/app/Grid';
import Spin from '../../atoms/app/Spin';

const LoaderView = () => (
    <Row justify="center" align="middle" gutter={[16, 16]}>
        <Col span={24} />
        <Col span={12}>
            <Spin size="large" />
        </Col>
    </Row>
);

export default LoaderView;
