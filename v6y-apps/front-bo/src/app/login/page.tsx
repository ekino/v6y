import { redirect } from 'next/navigation';
import * as React from 'react';

import VitalityAuthLoginView from '../../features/v6y-auth/components/VitalityAuthLoginView';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider';

export default async function Login() {
    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || '/');
    }

    return <VitalityAuthLoginView />;
}

async function getData() {
    const { authenticated, redirectTo, error } = await AuthServerProvider.check();

    return {
        authenticated,
        redirectTo,
        error,
    };
}
