'use client';

import { AuthPage as AuthPageBase } from '@refinedev/antd';
import { VitalityTitle } from '@v6y/shared-ui';
import * as React from 'react';

export const VitalityAuthUpdatePasswordView = () => {
    return (
        <AuthPageBase
            type="updatePassword"
            title={<VitalityTitle title="v6y-authentication.title" />}
        />
    );
};
