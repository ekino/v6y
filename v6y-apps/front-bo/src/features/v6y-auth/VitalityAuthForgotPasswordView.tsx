'use client';

import VitalityTitle from '@/commons/components/VitalityTitle';
import { AuthPage as AuthPageBase } from '@refinedev/antd';

export const VitalityAuthForgotPasswordView = () => {
    return (
        <AuthPageBase
            type="forgotPassword"
            title={<VitalityTitle title="v6y-authentication.title" />}
        />
    );
};
