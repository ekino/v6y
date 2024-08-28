import { redirect } from 'next/navigation';

import { VitalityAuthUpdatePasswordView } from '../../features/v6y-auth/VitalityAuthUpdatePasswordView.jsx';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider.js';

export default async function UpdatePassword() {
    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || '/');
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
