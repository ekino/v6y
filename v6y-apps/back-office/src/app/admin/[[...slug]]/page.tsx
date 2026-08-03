'use client';

import dynamic from 'next/dynamic';

// AdminApp mounts its own BrowserRouter/CoreAdminContext and depends on
// browser-only auth (cookies) and routing; disable SSR for it entirely.
const AdminApp = dynamic(() => import('../../../components/AdminApp.tsx'), {
    ssr: false,
});

export default function AdminPage() {
    return <AdminApp />;
}
