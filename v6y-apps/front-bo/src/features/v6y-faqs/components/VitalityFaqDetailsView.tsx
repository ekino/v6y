import { FaqType } from '@v6y/core-logic/src/types';
import {
    AdminShowWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/shared-ui';
import * as React from 'react';

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
