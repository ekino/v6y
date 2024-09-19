import { redirect } from 'next/navigation';

import { AuthServerProvider } from '../../infrastructure/providers/AuthServerProvider.js';


export default async function Layout({ children }) {
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
