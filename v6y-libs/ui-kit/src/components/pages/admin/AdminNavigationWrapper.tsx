import { useNavigation } from '@refinedev/core';
import * as React from 'react';

const AdminNavigationWrapper = () => {
    const { list } = useNavigation();

    React.useEffect(() => {
        // Navigate to the first resource's list page
        list('v6y-accounts');
    }, [list]);

    return null;
};

export default AdminNavigationWrapper;
