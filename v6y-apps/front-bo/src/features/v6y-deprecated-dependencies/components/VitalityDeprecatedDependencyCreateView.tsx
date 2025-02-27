import { AdminCreateWrapper, TitleView, useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    deprecatedDependencyCreateEditItems,
    deprecatedDependencyCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditDeprecatedDependency from '../apis/createOrEditDeprecatedDependency';

export default function VitalityDeprecatedDependencyCreateView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminCreateWrapper
            title={<TitleView title={translate('v6y-deprecated-dependencies.titles.create')} />}
            createOptions={{
                createFormAdapter: deprecatedDependencyCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditDeprecatedDependency,
                createQueryParams: {},
            }}
            formItems={deprecatedDependencyCreateEditItems(translate)}
        />
    );
}
