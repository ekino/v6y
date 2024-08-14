import { Col, Row, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

import VitalityPageHeaderMenu from './VitalityPageHeaderMenu.jsx';

const VitalityPageHeader = ({ title, subTitle }) => (
    <Row style={{ width: '100%', textAlign: 'center' }} justify="center" align="middle">
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
            <Link href="/dashboard">
                <Image
                    style={{ marginTop: '2rem', marginLeft: '1rem', objectFit: 'fill' }}
                    width={150}
                    height={40}
                    loading="lazy"
                    src="/ekino_logo.png"
                    alt="Ekino Logo"
                />
            </Link>
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
            <VitalityPageHeaderMenu />
        </Col>
    </Row>
);

export default VitalityPageHeader;
