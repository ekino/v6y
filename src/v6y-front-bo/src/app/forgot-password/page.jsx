import { redirect } from 'next/navigation';

import { VitalityAuthForgotPasswordView } from '../../features/v6y-auth/VitalityAuthForgotPasswordView.jsx';
import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider.js';


export default async function ForgotPassword() {
    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || '/');
    }

    return <VitalityAuthForgotPasswordView />;
}

async function getData() {
    const { authenticated, redirectTo, error } = await AuthServerProvider.check();

    return {
        authenticated,
        redirectTo,
        error,
    };
}
