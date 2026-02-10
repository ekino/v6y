'use client';

import * as React from 'react';

import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import AdminAuthenticationWrapper from '@v6y/ui-kit/components/pages/admin/AdminAuthenticationWrapper';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

export const VitalityAuthUpdatePasswordView = () => {
    const { translate } = useTranslationProvider();

    return (
        <AdminAuthenticationWrapper
            type="updatePassword"
            title={<TitleView title={translate('v6y-authentication.title')} />}
        />
    );
};
