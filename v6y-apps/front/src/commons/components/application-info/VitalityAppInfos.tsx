import {
    Col,
    Divider,
    Links,
    ListItem,
    ListItemMeta,
    Row,
    Tag,
    TextView,
    useNavigationAdapter,
    useThemeConfigProvider,
    useTranslationProvider,
} from '@v6y/ui-kit';
import Link from 'next/link';
import * as React from 'react';

import VitalityNavigationPaths from '../../config/VitalityNavigationPaths';
import { VitalityAppInfosProps } from '../../types/VitalityAppInfosProps';

const VitalityAppInfos = ({ app, source, canOpenDetails = true }: VitalityAppInfosProps) => {
    const { currentConfig } = useThemeConfigProvider();
    const { createUrlQueryParam } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const queryParams = createUrlQueryParam('_id', `${app._id}`);
    const appDetailsLink = source
        ? VitalityNavigationPaths.APP_DETAILS + '?' + queryParams + '&' + 'source=' + source
        : VitalityNavigationPaths.APP_DETAILS + '?' + queryParams;

    const appLinks = app.links;
    const appRepository = app.repo;
    const appOpenedBranches = app.repo?.allBranches?.length || 0;

    const qualityMetricStatus = currentConfig?.status || {};

    return (
        <ListItem>
            <ListItemMeta
                title={
                    <Row gutter={[12, 0]} justify="end" align="middle">
                        <Col span={24} />
                        <Col span={12}>{app.name}</Col>
                        <Col span={12}>
                            <Tag
                                color={
                                    appOpenedBranches >= 4
                                        ? qualityMetricStatus['error']
                                        : qualityMetricStatus['success']
                                }
                            >
                                {`${translate('vitality.appListPage.nbBranches')}${appOpenedBranches}`}
                            </Tag>
                        </Col>
                        <Col span={24}>
                            <Divider />
                        </Col>
                    </Row>
                }
                description={
                    <Row gutter={[12, 16]} justify="end" align="middle">
                        <Col span={24} />
                        <Col span={24}>
                            <TextView content={app.description || ''} />
                        </Col>
                        <Col span={24}>
                            <Links
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
                                    <TextView
                                        content={translate('vitality.appListPage.contactEmail')}
                                    />
                                </Link>
                            )}
                        </Col>
                        <Col>
                            {canOpenDetails && (
                                <Link key="app-details-link" href={appDetailsLink}>
                                    <TextView
                                        content={translate('vitality.appListPage.openDetails')}
                                        underline
                                    />
                                </Link>
                            )}
                        </Col>
                    </Row>
                }
            />
        </ListItem>
    );
};

export default VitalityAppInfos;
