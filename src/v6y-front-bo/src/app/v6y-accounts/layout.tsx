import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider';

export default async function Layout({ children }: { children: ReactNode }) {
    const data = await getData();

    if (!data.authenticated) {
        return redirect(data?.redirectTo || '/login');
    }

    return children;
}

async function getData() {
    const { authenticated, redirectTo } = await AuthServerProvider.check();

    return {
        authenticated,
        redirectTo,
    };
}
