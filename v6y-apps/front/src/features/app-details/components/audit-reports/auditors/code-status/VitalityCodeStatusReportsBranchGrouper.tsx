import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types/AuditType';
import { DynamicLoader, useTranslationProvider } from '@v6y/ui-kit';

import VitalitySelectGrouperView from '../../../../../../commons/components/VitalitySelectGrouperView';
import { VitalityModuleType } from '../../../../../../commons/types/VitalityModulesProps';

const VitalityCodeStatusReportsSmellGrouper = DynamicLoader(
    () => import('./VitalityCodeStatusReportsSmellGrouper'),
);

const VitalityCodeStatusReportsBranchGrouper = ({ reports }: { reports: AuditType[] }) => {
    const { translate } = useTranslationProvider();

    return (
        <VitalitySelectGrouperView
            name="code_status_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={translate('vitality.appDetailsPage.audit.selectPlaceholder')}
            label={translate('vitality.appDetailsPage.audit.selectLabel')}
            helper={translate('vitality.appDetailsPage.audit.selectHelper')}
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
