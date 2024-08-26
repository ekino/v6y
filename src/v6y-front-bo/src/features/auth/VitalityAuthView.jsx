'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { Typography } from 'antd';

import VitalityTerms from '../../commons/config/VitalityTerms.js';

export const VitalityAuthView = (props) => {
    return (
        <AuthPageBase
            {...props}
            title={
                <Typography.Title level={2}>
                    {VitalityTerms.VITALITY_AUTH_PAGE_TITLE}
                </Typography.Title>
            }
        />
    );
};
