import { VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditFaq from '../apis/createOrEditFaq';

export default function VitalityFaqCreateView() {
    const { translate } = useTranslationProvider();

    return (
        <RefineCreateWrapper
            title={<VitalityTitle title="v6y-faqs.titles.create" />}
            createOptions={{
                createFormAdapter: faqCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditFaq,
                createQueryParams: {},
            }}
            formItems={faqCreateEditItems(translate)}
        />
    );
}
