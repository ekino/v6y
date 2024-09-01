import { Typography } from 'antd';
import React from 'react';

import {
    deprecatedDependencyCreateEditItems,
    deprecatedDependencyCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper.jsx';
import CreateOrEditDeprecatedDependency from '../apis/createOrEditDeprecatedDependency.js';

export default function VitalityDeprecatedDependencyCreateView() {
    const { translate } = useTranslation();

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-deprecated-dependencies.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createFormAdapter: deprecatedDependencyCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditDeprecatedDependency,
                createQueryParams: {},
            }}
            formItems={deprecatedDependencyCreateEditItems(translate)}
        />
    );
}
