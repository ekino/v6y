import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { VitalityAuthConfig, VitalityAuthOptions } from '../../commons/auth/VitalityAuthHelper.js';
import { VitalityAuthView } from '../../features/auth/VitalityAuthView.jsx';

export default async function Login() {
    const data = await getData();

    if (data.session?.user) {
        return redirect('/');
    }

    return <VitalityAuthView {...VitalityAuthOptions.login} />;
}

async function getData() {
    const session = await getServerSession(VitalityAuthConfig);

    return {
        session,
    };
}
