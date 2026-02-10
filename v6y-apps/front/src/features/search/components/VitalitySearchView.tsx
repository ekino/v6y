import * as React from 'react';
import { Suspense } from 'react';

import LoaderView from '@v6y/ui-kit/components/organisms/app/LoaderView.tsx';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalitySearchView = ({}) => (
    <Suspense fallback={<LoaderView />}>
        <VitalityAppList source="search" />
    </Suspense>
);

export default VitalitySearchView;
