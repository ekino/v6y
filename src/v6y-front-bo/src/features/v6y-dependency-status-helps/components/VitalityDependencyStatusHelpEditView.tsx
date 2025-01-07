import { useParsed } from '@refinedev/core';
import * as React from 'react';

import VitalityTitle from '../../../commons/components/VitalityTitle';
import {
    dependencyStatusHelpCreateEditItems,
    dependencyStatusHelpCreateOrEditFormInAdapter,
    dependencyStatusHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditDependencyStatusHelp from '../apis/createOrEditDependencyStatusHelp';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams';

export default function VitalityDependencyStatusHelpEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={<VitalityTitle title="v6y-evolution-helps.titles.edit" />}
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
