import { AuditType } from '@v6y/core-logic/src/types';
import { DynamicLoader } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityCodeStatusReportsSmellGrouper = DynamicLoader(
    () => import('./VitalityCodeStatusReportsSmellGrouper'),
);

const VitalityCodeStatusReportsBranchGrouper = ({ reports }: { reports: AuditType[] }) => {
    return (
        <VitalitySelectGrouperView
            name="code_status_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_PLACEHOLDER}
            label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_LABEL}
            helper={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_HELPER}
            dataSource={reports}
            onRenderChildren={(_, data) => {
                return (
                    <>
                        {data && (
                            <VitalityCodeStatusReportsSmellGrouper
                                reports={data as VitalityModuleType[]}
                            />
                        )}
                    </>
                );
            }}
        />
    );
};

export default VitalityCodeStatusReportsBranchGrouper;
