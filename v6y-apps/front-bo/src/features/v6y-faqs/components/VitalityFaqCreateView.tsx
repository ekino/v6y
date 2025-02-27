import { AdminCreateWrapper, TitleView, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditFaq from '../apis/createOrEditFaq';

export default function VitalityFaqCreateView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminCreateWrapper
            title={<TitleView title={translate('v6y-faqs.titles.create')} />}
            createOptions={{
                createFormAdapter: faqCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditFaq,
                createQueryParams: {},
            }}
            formItems={faqCreateEditItems(translate)}
        />
    );
}
