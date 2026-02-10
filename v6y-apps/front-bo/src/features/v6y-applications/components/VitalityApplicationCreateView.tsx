import * as React from 'react';

import AdminCreateWrapper from '@v6y/ui-kit/components/organisms/admin/AdminCreateWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditApplication from '../apis/createOrEditApplication';

export default function VitalityApplicationCreateView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminCreateWrapper
            title={<TitleView title={translate('v6y-applications.titles.create')} />}
            createOptions={{
                createFormAdapter: applicationCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditApplication,
                createQueryParams: {},
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}
