'use client';

import {
    Col,
    FloatButton,
    Row,
    TitleView,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import { Toaster } from '@v6y/ui-kit-front';
import * as React from 'react';
import { ReactNode } from 'react';

import { buildPageTitle } from '../../config/VitalityCommonConfig';
import ProtectedRoute from '../ProtectedRoute';
import VitalityBot from '../chatbot/VitalityBot';
import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageFooter from './VitalityPageFooter';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    const { pathname } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const pageTitle = buildPageTitle(pathname, translate);

    return (
        <>
            <VitalityPageHeader />
            <ProtectedRoute>
                <Row justify="center" align="middle" gutter={[12, 12]}>
                    <Col span={23}>
                        <VitalityBreadcrumb />
                    </Col>
                    <Col span={20}>{pageTitle && <TitleView title={pageTitle as string} />}</Col>
                    <Col span={18}>{children}</Col>
                </Row>
            </ProtectedRoute>

            <VitalityPageFooter />
            <VitalityBot />
            <FloatButton.BackTop />
            <Toaster position="top-center" richColors />
        </>
    );
};

export default VitalityPageLayout;
