import * as React from 'react';

import AdminCreateWrapper from '@v6y/ui-kit/components/organisms/admin/AdminCreateWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

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
