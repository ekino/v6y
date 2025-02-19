import { useParsed } from '@refinedev/core';
import { VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    auditHelpCreateEditItems,
    auditHelpCreateOrEditFormInAdapter,
    auditHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditAuditHelp from '../apis/createOrEditAuditHelp';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

export default function VitalityAuditHelpEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={<VitalityTitle title="v6y-audit-helps.titles.edit" />}
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
