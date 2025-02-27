import { Col, Row, TitleView } from '@v6y/ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import VitalityPageHeaderMenu from './VitalityPageHeaderMenu';

const VitalityPageHeader = ({ title, subTitle }: { title: string; subTitle: string }) => (
    <Row>
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
            <Link href={VitalityNavigationPaths.DASHBOARD}>
                <Image
                    width={150}
                    height={40}
                    loading="lazy"
                    src="/ekino_logo.png"
                    alt="Ekino Logo"
                />
            </Link>
        </Col>
        <Col xs={16} sm={16} md={16} lg={16} xl={16}>
            <TitleView title={title} subTitle={subTitle} />
        </Col>
        <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <VitalityPageHeaderMenu />
        </Col>
    </Row>
);

export default VitalityPageHeader;
