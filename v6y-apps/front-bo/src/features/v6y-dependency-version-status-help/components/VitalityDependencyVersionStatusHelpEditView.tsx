import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import * as React from 'react';

import {
    dependencyVersionStatusHelpCreateEditItems,
    dependencyVersionStatusHelpCreateOrEditFormInAdapter,
    dependencyVersionStatusHelpCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditDependencyVersionStatusHelp from '../apis/createOrEditDependencyVersionStatusHelp';
import GetDependencyVersionStatusHelpDetailsByParams from '../apis/getDependencyVersionStatusHelpDetailsByParams';

export default function VitalityDependencyVersionStatusHelpEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-evolution-help.titles.edit')}
                </Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: dependencyVersionStatusHelpCreateOrEditFormInAdapter,
                query: GetDependencyVersionStatusHelpDetailsByParams,
                queryResource: 'getDependencyVersionStatusHelpDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: dependencyVersionStatusHelpCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditDependencyVersionStatusHelp,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={dependencyVersionStatusHelpCreateEditItems(translate)}
        />
    );
}
