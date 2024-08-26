import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react';

import { VitalityAuthConfig } from '../../commons/auth/VitalityAuthHelper.js';

export default async function LoginLayout({ children }) {
    const data = await getData();

    if (data.session?.user) {
        return redirect('/');
    }

    return <>{children}</>;
}

async function getData() {
    const session = await getServerSession(VitalityAuthConfig);

    return {
        session,
    };
}
