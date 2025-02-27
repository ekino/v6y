import { AdminCreateWrapper, TitleView, useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

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
