import {
    AdminEditWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/ui-kit';
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
            title={<TitleView title={translate('v6y-audit-helps.titles.edit')} />}
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
