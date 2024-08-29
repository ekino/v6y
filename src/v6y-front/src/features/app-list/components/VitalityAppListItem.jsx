import { Col, Row, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

import VitalityTags from '../../../commons/components/VitalityTags.jsx';
import VitalityNavigationPaths from '../../../commons/config/VitalityNavigationPaths.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';

const VitalityAppListItem = ({ app, source, canOpenDetails = true }) => {
    const { creatUrlQueryParam } = useNavigationAdapter();
    const queryParams = creatUrlQueryParam('appId', app._id);
    const appDetailsLink = source
        ? VitalityNavigationPaths.APP_DETAILS + '?' + queryParams + '&' + 'source=' + source
        : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

    return (
        <Row style={{ width: '100%' }} gutter={[12, 12]} justify="center" align="middle">
            <Col span={24} style={{ textAlign: 'center', marginTop: '-1rem' }}>
                <Typography.Title level={4}>{app.name}</Typography.Title>
            </Col>
            <Col span={24}>
                <Typography.Text>{app.description}</Typography.Text>
            </Col>
            <Col span={24}>
                <Typography.Text>{app.contactMail}</Typography.Text>
            </Col>
            <Col span={24}>
                <VitalityTags align="center" tags={app.keywords || []} />
            </Col>
            {canOpenDetails && (
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Link href={appDetailsLink}>
                        <Typography.Text underline>
                            {VitalityTerms.VITALITY_APP_LIST_OPEN_DETAILS_LABEL}
                        </Typography.Text>
                    </Link>
                </Col>
            )}
        </Row>
    );
};

export default VitalityAppListItem;
