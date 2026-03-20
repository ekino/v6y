import { useGo } from '@refinedev/core';
import * as React from 'react';

const AdminNavigationWrapper = () => {
    const go = useGo();

    React.useEffect(() => {
        // Navigate to the first resource's list page
        go({ to: { resource: 'v6y-accounts', action: 'list' } });
    }, [go]);

    return null;
};

export default AdminNavigationWrapper;
