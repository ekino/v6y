import * as React from 'react';

import AdminEditWrapper from '@v6y/ui-kit/components/organisms/admin/AdminEditWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import {
    faqCreateEditItems,
    faqCreateOrEditFormInAdapter,
    faqCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditFaq from '../apis/createOrEditFaq';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

export default function VitalityFaqEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<TitleView title={translate('v6y-faqs.titles.edit')} />}
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
