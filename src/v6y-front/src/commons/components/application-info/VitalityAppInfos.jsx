import { Col, List, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import { QUALITY_METRIC_STATUS } from '../../config/VitalityCommonConfig.js';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths.js';
import VitalityTerms from '../../config/VitalityTerms.js';
import VitalityLinks from '../VitalityLinks.jsx';

const VitalityAppInfos = ({ app, source, canOpenDetails = true }) => {
    const { creatUrlQueryParam } = useNavigationAdapter();
    const queryParams = creatUrlQueryParam('appId', app._id);
    const appDetailsLink = source
        ? VitalityNavigationPaths.APP_DETAILS + '?' + queryParams + '&' + 'source=' + source
        : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

    const appLinks = app.links;
    const appRepository = app.repo;
    const appOpenedBranches = app.repo?.allBranches?.length || 0;

    return (
        <List.Item>
            <List.Item.Meta
                title={app.name}
                description={
                    <>
                        <Row gutter={[12, 12]} justify="end" align="middle">
                            <Col span={24} />
                            <Col span={20} style={{ textAlign: 'right' }}>
                                <Tag
                                    color={
                                        appOpenedBranches >= 10
                                            ? QUALITY_METRIC_STATUS['error']
                                            : QUALITY_METRIC_STATUS['success']
                                    }
                                >
                                    {`${VitalityTerms.VITALITY_APP_LIST_NB_BRANCHES}${appOpenedBranches}`}
                                </Tag>
                            </Col>
                            <Col span={24} style={{ textAlign: 'left' }}>
                                <Typography.Text>{app.description}</Typography.Text>
                            </Col>
                            <Col span={24}>
                                <VitalityLinks
                                    align="center"
                                    links={[
                                        ...(appLinks || []),
                                        {
                                            label: appRepository?.name,
                                            value: appRepository?.webUrl,
                                        },
                                    ]}
                                />
                            </Col>
                            <Col>
                                {app.contactMail?.length && (
                                    <Link
                                        key="team-mail-contact"
                                        href={`mailto:${app.contactMail}`}
                                    >
                                        <Typography.Text>
                                            {VitalityTerms.VITALITY_APP_LIST_CONTACT_EMAIL}
                                        </Typography.Text>
                                    </Link>
                                )}
                            </Col>
                            <Col>
                                {canOpenDetails && (
                                    <Link key="app-details-link" href={appDetailsLink}>
                                        <Typography.Text underline>
                                            {VitalityTerms.VITALITY_APP_LIST_OPEN_DETAILS_LABEL}
                                        </Typography.Text>
                                    </Link>
                                )}
                            </Col>
                        </Row>
                    </>
                }
            />
        </List.Item>
    );
};

export default VitalityAppInfos;
