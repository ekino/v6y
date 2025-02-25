import { AdminEditWrapper, VitalityTitle, useAdminNavigationParamsParser } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    deprecatedDependencyCreateEditItems,
    deprecatedDependencyCreateOrEditFormInAdapter,
    deprecatedDependencyCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditDeprecatedDependency from '../apis/createOrEditDeprecatedDependency';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams';

export default function VitalityDeprecatedDependencyEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<VitalityTitle title={translate('v6y-deprecated-dependencies.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: deprecatedDependencyCreateOrEditFormInAdapter,
                query: GetDeprecatedDependencyDetailsByParams,
                queryResource: 'getDeprecatedDependencyDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: deprecatedDependencyCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditDeprecatedDependency,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={deprecatedDependencyCreateEditItems(translate)}
        />
    );
}
