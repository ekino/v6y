import { Typography } from 'antd';
import * as React from 'react';

import {
    faqCreateEditItems,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditFaq from '../apis/createOrEditFaq';

export default function VitalityFaqCreateView() {
    const { translate } = useTranslation();

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>{translate('v6y-faqs.titles.create')}</Typography.Title>
            }
            createOptions={{
                createFormAdapter: faqCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditFaq,
                createQueryParams: {},
            }}
            formItems={faqCreateEditItems(translate)}
        />
    );
}
