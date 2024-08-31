import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormInAdapter,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditFaq from '../apis/createOrEditFaq.js';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams.js';

export default function VitalityFaqEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>{translate('v6y-faqs.titles.edit')}</Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: faqCreateOrEditFormInAdapter,
                query: GetFaqDetailsByParams,
                queryResource: 'getFaqDetailsByParams',
                queryParams: {
                    faqId: id,
                },
            }}
            mutationOptions={{
                editFormAdapter: faqCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditFaq,
                editQueryParams: {
                    faqId: id,
                },
            }}
            formItems={faqCreateEditItems(translate)}
        />
    );
}
