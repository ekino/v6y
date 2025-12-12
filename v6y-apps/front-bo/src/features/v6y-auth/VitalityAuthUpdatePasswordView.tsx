'use client';

import * as React from 'react';

import { AdminAuthenticationWrapper, TitleView, useTranslationProvider } from '@v6y/ui-kit';

export const VitalityAuthUpdatePasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="updatePassword"
            title={<TitleView title={translate('v6y-authentication.title')} />}
        />
    );
};
