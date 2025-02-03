'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { VitalityTitle } from '@v6y/shared-ui';
import React from 'react';

export const VitalityAuthForgotPasswordView = () => {
    return (
        <AuthPageBase
            type="forgotPassword"
            title={<VitalityTitle title="v6y-authentication.title" />}
        />
    );
};
