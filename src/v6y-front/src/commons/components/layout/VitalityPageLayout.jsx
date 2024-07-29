'use client';

import React from 'react';
import { Col, FloatButton, Layout, Row, Typography } from 'antd';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import VitalityCommonUtils from '../../utils/VitalityCommonUtils.js';
import VitalityPageHeader from './VitalityPageHeader.jsx';
import VitalityPageFooter from './VitalityPageFooter.jsx';
import VitalityBot from '../chatbot/VitalityBot.jsx';
import VitalityBreadcrumb from './VitalityBreadcrumb.jsx';

const { Header, Footer, Content } = Layout;

const { buildPageTitle } = VitalityCommonUtils;

const VitalityPageLayout = ({ children }) => {
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
                tagName="div"
                style={{
                    margin: '0',
                    paddingTop: '1rem',
                }}
            >
                <Row justify="center" align="middle" gutter={[12, 12]}>
                    <Col span={23}>
                        <VitalityBreadcrumb />
                    </Col>
                    <Col span={20} style={{ textAlign: 'center' }}>
                        <Typography.Title level={2}>{pageTitle}</Typography.Title>
                    </Col>
                    <Col span={18}>{children}</Col>
                </Row>
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
