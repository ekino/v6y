import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    evolutionHelpCreateEditItems,
    evolutionHelpCreateOrEditFormInAdapter,
    evolutionHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper.jsx';
import CreateOrEditEvolutionHelp from '../apis/createOrEditEvolutionHelp.js';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams.js';
import GetEvolutionHelpStatus from '../apis/getEvolutionHelpStatus.js';

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
                    evolutionHelpId: id,
                },
            }}
            mutationOptions={{
                editFormAdapter: evolutionHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditEvolutionHelp,
                editQueryParams: {
                    evolutionHelpId: id,
                },
            }}
            selectOptions={{
                resource: 'getEvolutionHelpStatus',
                query: GetEvolutionHelpStatus,
            }}
            formItems={(options) => evolutionHelpCreateEditItems(translate, options)}
        />
    );
}
