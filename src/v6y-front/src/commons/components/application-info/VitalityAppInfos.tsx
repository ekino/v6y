import { Col, Divider, List, Row, Tag, Typography } from 'antd';
import Link from 'next/link';
import * as React from 'react';

import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter';
import { QUALITY_METRIC_STATUS } from '../../config/VitalityCommonConfig';
import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import VitalityTerms from '../../config/VitalityTerms';
import { VitalityAppInfosProps } from '../../types/VitalityAppInfosProps';
import VitalityLinks from '../VitalityLinks';

const VitalityAppInfos = ({ app, source, canOpenDetails = true, style }: VitalityAppInfosProps) => {
    const { creatUrlQueryParam } = useNavigationAdapter();
    const queryParams = creatUrlQueryParam('_id', `${app._id}`);
    const appDetailsLink = source
        ? VitalityNavigationPaths.APP_DETAILS + '?' + queryParams + '&' + 'source=' + source
        : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

    const appLinks = app.links;
    const appRepository = app.repo;
    const appOpenedBranches = app.repo?.allBranches?.length || 0;

    console.log({app, source, canOpenDetails})

    return (
        <List.Item style={{ marginTop: '1rem', ...(style || {}) }}>
            <List.Item.Meta
                title={
                    <Row gutter={[12, 0]} justify="end" align="middle">
                        <Col span={24} />
                        <Col span={12} style={{ textAlign: 'left' }}>
                            {app.name}
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
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
                        <Col span={24}>
                            <Divider style={{ marginBottom: '0' }} />
                        </Col>
                    </Row>
                }
                description={
                    <Row gutter={[12, 16]} justify="end" align="middle">
                        <Col span={24} />
                        <Col span={24} style={{ textAlign: 'left', marginTop: '0' }}>
                            <Typography.Text>{app.description}</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <VitalityLinks
                                align="center"
                                links={[
                                    ...(appLinks || []),
                                    {
                                        label: appRepository?.organization || '',
                                        value: appRepository?.webUrl,
                                    },
                                ]}
                            />
                        </Col>
                        <Col>
                            {app.contactMail?.length && (
                                <Link key="team-mail-contact" href={`mailto:${app.contactMail}`}>
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
                }
            />
        </List.Item>
    );
};

export default VitalityAppInfos;
