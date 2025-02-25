'use client';

import { Col, FloatButton, Layout, Row, VitalityTitle, useNavigationAdapter } from '@v6y/shared-ui';
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
        <Layout style={{ minHeight: '98vh', width: '100%' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0',
                    padding: '0',
                }}
            >
                <VitalityPageHeader title="VITALITY" subTitle="v6y" />
            </Header>
            <Content
                style={{
                    margin: '0',
                    paddingTop: '1rem',
                }}
            >
                <ProtectedRoute>
                    <Row justify="center" align="middle" gutter={[12, 12]}>
                        <Col span={23}>
                            <VitalityBreadcrumb />
                        </Col>
                        <Col span={20} style={{ textAlign: 'center' }}>
                            {pageTitle && <VitalityTitle title={pageTitle as string} />}
                        </Col>
                        <Col span={18}>{children}</Col>
                    </Row>
                </ProtectedRoute>
            </Content>
            <Footer
                style={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0',
                    padding: '0',
                }}
            >
                <VitalityPageFooter />
            </Footer>
            <VitalityBot />
            <FloatButton.BackTop
                style={{
                    left: '50%',
                }}
            />
        </Layout>
    );
};

export default VitalityPageLayout;
