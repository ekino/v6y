import { redirect } from 'next/navigation';
import * as React from 'react';

import { VitalityAuthRegisterView } from '../../features/v6y-auth/VitalityAuthRegisterView';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider';

export default async function Register() {
    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || '/');
    }

    return <VitalityAuthRegisterView />;
}

async function getData() {
    const { authenticated, redirectTo, error } = await AuthServerProvider.check();

    return {
        authenticated,
        redirectTo,
        error,
    };
}
