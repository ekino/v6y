import { VitalityTitle } from '@v6y/shared-ui';
import { Col, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import VitalityPageHeaderMenu from './VitalityPageHeaderMenu';

const VitalityPageHeader = ({ title, subTitle }: { title: string; subTitle: string }) => (
    <Row style={{ width: '100%', textAlign: 'center' }} justify="center" align="middle">
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
            <Link href={VitalityNavigationPaths.DASHBOARD}>
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
            <VitalityTitle title={title} subTitle={subTitle} />
        </Col>
        <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <VitalityPageHeaderMenu />
        </Col>
    </Row>
);

export default VitalityPageHeader;
