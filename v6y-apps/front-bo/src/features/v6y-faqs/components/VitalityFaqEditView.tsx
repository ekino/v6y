import { useParsed } from '@refinedev/core';
import { VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormInAdapter,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditFaq from '../apis/createOrEditFaq';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

export default function VitalityFaqEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={<VitalityTitle title="v6y-faqs.titles.edit" />}
            queryOptions={{
                queryFormAdapter: faqCreateOrEditFormInAdapter,
                query: GetFaqDetailsByParams,
                queryResource: 'getFaqDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: faqCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditFaq,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={faqCreateEditItems(translate)}
        />
    );
}
