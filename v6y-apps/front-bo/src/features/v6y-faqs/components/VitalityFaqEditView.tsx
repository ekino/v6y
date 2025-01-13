import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import * as React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormInAdapter,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditFaq from '../apis/createOrEditFaq';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

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
