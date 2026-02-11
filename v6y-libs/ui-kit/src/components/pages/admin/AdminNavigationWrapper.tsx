import { useRouter } from 'next/navigation';
import * as React from 'react';

const AdminNavigationWrapper = () => {
    const router = useRouter();

    React.useEffect(() => {
        router.push('/v6y-accounts');
    }, [router]);

    return null;
};

export default AdminNavigationWrapper;
