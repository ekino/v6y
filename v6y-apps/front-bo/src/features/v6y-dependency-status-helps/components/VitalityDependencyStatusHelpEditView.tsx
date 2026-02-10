import * as React from 'react';

import AdminEditWrapper from '@v6y/ui-kit/components/organisms/admin/AdminEditWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import {
    dependencyStatusHelpCreateEditItems,
    dependencyStatusHelpCreateOrEditFormInAdapter,
    dependencyStatusHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditDependencyStatusHelp from '../apis/createOrEditDependencyStatusHelp';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams';

export default function VitalityDependencyStatusHelpEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<TitleView title={translate('v6y-evolution-helps.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: dependencyStatusHelpCreateOrEditFormInAdapter,
                query: GetDependencyStatusHelpDetailsByParams,
                queryResource: 'getDependencyStatusHelpDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: dependencyStatusHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditDependencyStatusHelp,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={dependencyStatusHelpCreateEditItems(translate)}
        />
    );
}
