'use client';

import { Col, FloatButton, Layout, Row, TitleView, useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';
import { ReactNode } from 'react';

import { buildPageTitle } from '../../config/VitalityCommonConfig';
import ProtectedRoute from '../ProtectedRoute';
import VitalityBot from '../chatbot/VitalityBot';
import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageFooter from './VitalityPageFooter';
import VitalityPageHeader from './VitalityPageHeader';

const { Header, Footer, Content } = Layout;

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    const { pathname } = useNavigationAdapter();
    const pageTitle = buildPageTitle(pathname);

    return (
        <Layout>
            <Header>
                <VitalityPageHeader title="VITALITY" subTitle="v6y" />
            </Header>
            <Content>
                <ProtectedRoute>
                    <Row justify="center" align="middle" gutter={[12, 12]}>
                        <Col span={23}>
                            <VitalityBreadcrumb />
                        </Col>
                        <Col span={20}>
                            {pageTitle && <TitleView title={pageTitle as string} />}
                        </Col>
                        <Col span={18}>{children}</Col>
                    </Row>
                </ProtectedRoute>
            </Content>
            <Footer>
                <VitalityPageFooter />
            </Footer>
            <VitalityBot />
            <FloatButton.BackTop />
        </Layout>
    );
};

export default VitalityPageLayout;
