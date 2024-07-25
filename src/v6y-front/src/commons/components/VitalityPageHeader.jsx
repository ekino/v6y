import { Col, Image, Row, Typography } from 'antd';
import VitalityMenuItems from './VitalityMenuItems.jsx';

const VitalityPageHeader = ({ title, subTitle }) => (
    <Row style={{ width: '100%', textAlign: 'center' }} justify="center" align="middle">
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
            <Image width={150} loading="lazy" src="/ekino_logo.png" alt="Ekino Logo" />
        </Col>
        <Col xs={16} sm={16} md={16} lg={16} xl={16}>
            <Typography.Title>
                {title}
                <sup>
                    <Typography.Text>{subTitle}</Typography.Text>
                </sup>
            </Typography.Title>
        </Col>
        <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <VitalityMenuItems />
        </Col>
    </Row>
);

export default VitalityPageHeader;
