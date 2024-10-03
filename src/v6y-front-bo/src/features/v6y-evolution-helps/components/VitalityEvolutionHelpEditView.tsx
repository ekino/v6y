import { useParsed } from '@refinedev/core';
import { EvolutionHelpType } from '@v6y/commons';
import { Typography } from 'antd';
import * as React from 'react';

import {
    evolutionHelpCreateEditItems,
    evolutionHelpCreateOrEditFormInAdapter,
    evolutionHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
import CreateOrEditEvolutionHelp from '../apis/createOrEditEvolutionHelp';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';
import GetEvolutionHelpStatus from '../apis/getEvolutionHelpStatus';

export default function VitalityEvolutionHelpEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineSelectWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-evolution-helps.titles.edit')}
                </Typography.Title>
            }
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
