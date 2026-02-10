import * as React from 'react';

import { FaqType } from '@v6y/core-logic/src/types/FaqType';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatFaqDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

export default function VitalityFaqDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-faqs.titles.show')} />}
            queryOptions={{
                resource: 'getFaqDetailsByParams',
                query: GetFaqDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatFaqDetails(translate, data as FaqType)}
                    error={error}
                />
            )}
        />
    );
}
