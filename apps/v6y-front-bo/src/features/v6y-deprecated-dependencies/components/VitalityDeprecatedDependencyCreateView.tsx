import { Typography } from 'antd';
import * as React from 'react';

import {
    deprecatedDependencyCreateEditItems,
    deprecatedDependencyCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditDeprecatedDependency from '../apis/createOrEditDeprecatedDependency';

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
