import { VitalityTitle } from '@v6y/shared-ui/src/components/VitalityTitle/VitalityTitle';
import * as React from 'react';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditApplication from '../apis/createOrEditApplication';

export default function VitalityApplicationCreateView() {
    const { translate } = useTranslation();
    return (
        <RefineCreateWrapper
            title={<VitalityTitle title="v6y-applications.titles.create" />}
            createOptions={{
                createFormAdapter: applicationCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditApplication,
                createQueryParams: {},
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}
