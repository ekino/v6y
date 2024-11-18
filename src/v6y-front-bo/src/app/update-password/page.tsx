import { redirect } from 'next/navigation';
import * as React from 'react';

import { VitalityAuthUpdatePasswordView } from '../../features/v6y-auth/components/VitalityAuthUpdatePasswordView';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider';

export default async function UpdatePassword() {
    const data = await getData();

    if (!data.authenticated) {
        redirect(data?.redirectTo || '/login');
    }

    return <VitalityAuthUpdatePasswordView />;
}

async function getData() {
    const { authenticated, redirectTo, error } = await AuthServerProvider.check();

    return {
        authenticated,
        redirectTo,
        error,
    };
}
