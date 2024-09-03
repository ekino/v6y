import { List, Space, Typography } from 'antd';
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
        <List.Item
            actions={[
                app.contactMail?.length ? (
                    <Link key="team-mail-contact" href={`mailto:${app.contactMail}`}>
                        <Typography.Text>
                            {VitalityTerms.VITALITY_APP_LIST_CONTACT_EMAIL}
                        </Typography.Text>
                    </Link>
                ) : null,
                canOpenDetails ? (
                    <Link key="app-details-link" href={appDetailsLink}>
                        <Typography.Text underline>
                            {VitalityTerms.VITALITY_APP_LIST_OPEN_DETAILS_LABEL}
                        </Typography.Text>
                    </Link>
                ) : null,
            ]?.filter((item) => item)}
        >
            <List.Item.Meta
                title={<Typography.Title level={4}>{app.name}</Typography.Title>}
                description={
                    <Space direction="vertical" size="large">
                        <Typography.Text>{app.description}</Typography.Text>
                        <VitalityTags align="end" tags={app.keywords || []} />
                    </Space>
                }
            />
        </List.Item>
    );
};

export default VitalityAppListItem;
