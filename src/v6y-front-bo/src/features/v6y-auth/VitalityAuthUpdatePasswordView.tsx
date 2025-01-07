'use client';

import VitalityTitle from '@/commons/components/VitalityTitle';
import { AuthPage as AuthPageBase } from '@refinedev/antd';

export const VitalityAuthUpdatePasswordView = () => {
    return (
        <AuthPageBase
            type="updatePassword"
            title={<VitalityTitle title="v6y-authentication.title" />}
        />
    );
};
