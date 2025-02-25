import { AdminEditWrapper, VitalityTitle, useAdminNavigationParamsParser } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    auditHelpCreateEditItems,
    auditHelpCreateOrEditFormInAdapter,
    auditHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditAuditHelp from '../apis/createOrEditAuditHelp';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

export default function VitalityAuditHelpEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<VitalityTitle title={translate('v6y-audit-helps.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: auditHelpCreateOrEditFormInAdapter,
                query: GetAuditHelpDetailsByParams,
                queryResource: 'getAuditHelpDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: auditHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditAuditHelp,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={auditHelpCreateEditItems(translate)}
        />
    );
}
