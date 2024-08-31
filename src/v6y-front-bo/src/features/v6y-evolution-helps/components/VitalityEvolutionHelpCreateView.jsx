import { Typography } from 'antd';
import React from 'react';

import {
    evolutionHelpCreateEditItems,
    evolutionHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper.jsx';
import CreateOrEditEvolutionHelp from '../../v6y-evolution-helps/apis/createOrEditEvolutionHelp.js';

export default function VitalityEvolutionHelpCreateView() {
    const { translate } = useTranslation();

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-evolution-helps.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createFormAdapter: evolutionHelpCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditEvolutionHelp,
                createQueryParams: {},
            }}
            formItems={evolutionHelpCreateEditItems(translate)}
        />
    );
}
