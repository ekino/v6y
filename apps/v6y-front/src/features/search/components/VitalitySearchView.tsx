import * as React from 'react';
import { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader';
import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalitySearchView = ({}) => (
    <Suspense fallback={<VitalityLoader />}>
        <VitalityAppList source="search" />
    </Suspense>
);

export default VitalitySearchView;
