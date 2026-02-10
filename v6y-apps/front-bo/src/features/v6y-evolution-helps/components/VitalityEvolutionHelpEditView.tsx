import * as React from 'react';

import { EvolutionHelpType } from '@v6y/core-logic/src/types/EvolutionHelpType';
import AdminSelectWrapper from '@v6y/ui-kit/components/organisms/admin/AdminSelectWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import {
    evolutionHelpCreateEditItems,
    evolutionHelpCreateOrEditFormInAdapter,
    evolutionHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditEvolutionHelp from '../apis/createOrEditEvolutionHelp';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';
import GetEvolutionHelpStatus from '../apis/getEvolutionHelpStatus';

export default function VitalityEvolutionHelpEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminSelectWrapper
            title={<TitleView title={translate('v6y-evolution-helps.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: evolutionHelpCreateOrEditFormInAdapter,
                query: GetEvolutionHelpDetailsByParams,
                queryResource: 'getEvolutionHelpDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: evolutionHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditEvolutionHelp,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            selectOptions={{
                resource: 'getEvolutionHelpStatus',
                query: GetEvolutionHelpStatus,
            }}
            renderSelectOption={(options) =>
                evolutionHelpCreateEditItems(translate, options as EvolutionHelpType[])
            }
        />
    );
}
