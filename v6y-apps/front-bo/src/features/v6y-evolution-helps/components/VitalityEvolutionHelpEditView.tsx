import { useParsed } from '@refinedev/core';
import { EvolutionHelpType } from '@v6y/core-logic';
import { VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    evolutionHelpCreateEditItems,
    evolutionHelpCreateOrEditFormInAdapter,
    evolutionHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
import CreateOrEditEvolutionHelp from '../apis/createOrEditEvolutionHelp';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';
import GetEvolutionHelpStatus from '../apis/getEvolutionHelpStatus';

export default function VitalityEvolutionHelpEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useParsed();

    return (
        <RefineSelectWrapper
            title={<VitalityTitle title="v6y-evolution-helps.titles.edit" />}
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
