import React, { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityAppList from '../../app-list/components/VitalityAppList.jsx';

const VitalitySearchView = ({}) => (
    <Suspense fallback={<VitalityLoader />}>
        <VitalityAppList source="search" />
    </Suspense>
);

export default VitalitySearchView;
