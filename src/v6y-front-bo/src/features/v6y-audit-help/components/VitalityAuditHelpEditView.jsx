import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    auditHelpCreateEditItems,
    auditHelpCreateOrEditFormInAdapter,
    auditHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditAuditHelp from '../apis/createOrEditAuditHelp.js';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams.js';

export default function VitalityAuditHelpEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-audit-helps.titles.edit')}
                </Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: auditHelpCreateOrEditFormInAdapter,
                query: GetAuditHelpDetailsByParams,
                queryResource: 'getAuditHelpDetailsByParams',
                queryParams: {
                    auditHelpId: id,
                },
            }}
            mutationOptions={{
                editFormAdapter: auditHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditAuditHelp,
                editQueryParams: {
                    auditHelpId: id,
                },
            }}
            formItems={auditHelpCreateEditItems(translate)}
        />
    );
}
