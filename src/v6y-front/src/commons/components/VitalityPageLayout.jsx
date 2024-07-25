'use client';

import { Flex, FloatButton, Layout, Typography } from 'antd';
import ThemeConfigProvider from '../theme/ThemeConfigProvider.jsx';
import VitalityPageHeader from './VitalityPageHeader.jsx';
import VitalityPageFooter from './VitalityPageFooter.jsx';
import VitalityBot from './chatbot/VitalityBot.jsx';
import VitalityBreadcrumb from './bread-crumb/VitalityBreadcrumb.jsx';
import React from 'react';

const { Header, Footer, Content } = Layout;

const VitalityPageLayout = ({ pageTitle, children }) => {
    return (
        <ThemeConfigProvider>
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
                        padding: '0',
                    }}
                >
                    <VitalityBreadcrumb />
                    <Flex justify="center" align="center">
                        <Typography.Title level={2}>{pageTitle}</Typography.Title>
                    </Flex>
                    {children}
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
        </ThemeConfigProvider>
    );
};

export default VitalityPageLayout;
