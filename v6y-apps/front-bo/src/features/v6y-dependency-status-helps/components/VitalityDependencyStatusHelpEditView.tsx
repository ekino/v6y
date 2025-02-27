import {
    AdminEditWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/shared-ui';
import * as React from 'react';

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
