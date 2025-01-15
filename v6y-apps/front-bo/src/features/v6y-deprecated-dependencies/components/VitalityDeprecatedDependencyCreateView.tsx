import { VitalityTitle } from '@v6y/shared-ui/src/components/VitalityTitle';
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
            title={<VitalityTitle title="v6y-deprecated-dependencies.titles.create" />}
            createOptions={{
                createFormAdapter: deprecatedDependencyCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditDeprecatedDependency,
                createQueryParams: {},
            }}
            formItems={deprecatedDependencyCreateEditItems(translate)}
        />
    );
}
