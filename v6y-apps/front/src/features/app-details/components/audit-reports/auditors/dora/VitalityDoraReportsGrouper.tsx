import { AuditType } from '@v6y/core-logic/src/types';
import { DynamicLoader } from '@v6y/ui-kit';
import * as React from 'react';

import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityModuleList = DynamicLoader(
    () => import('../../../../../../commons/components/modules/VitalityModuleList'),
);

const VitalityDoraReportsGrouper = ({ reports }: { reports: AuditType[] }) => {
    return <VitalityModuleList modules={reports as VitalityModuleType[]} source="dora" />;
};

export default VitalityDoraReportsGrouper;

