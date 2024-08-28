import { redirect } from 'next/navigation';

import { VitalityAuthLoginView } from '../../features/v6y-auth/VitalityAuthLoginView.jsx';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider.js';

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
