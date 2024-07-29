import { Col, Row, Typography } from 'antd';
import Link from 'next/link';

const VitalityLinks = ({ links }) => (
    <Row gutter={[12, 12]} justify="end" align="middle">
        {links?.map((link, index) => (
            <Col key={`${link.label}-${index}`}>
                <Link href={link.value} style={{ textDecoration: 'underline' }}>
                    <Typography.Text>{link.label}</Typography.Text>
                </Link>
            </Col>
        ))}
    </Row>
);

export default VitalityLinks;
