import { LoaderView } from '@v6y/shared-ui';
import * as React from 'react';
import { Suspense } from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalitySearchView = ({}) => (
    <Suspense fallback={<LoaderView />}>
        <VitalityAppList source="search" />
    </Suspense>
);

export default VitalitySearchView;
