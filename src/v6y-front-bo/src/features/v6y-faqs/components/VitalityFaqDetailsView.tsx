import { HttpError, useParsed } from '@refinedev/core';
import { FaqType } from '@v6y/commons';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatFaqDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

export default function VitalityFaqDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>{translate('v6y-faqs.titles.show')}</Typography.Title>
            }
            queryOptions={{
                resource: 'getFaqDetailsByParams',
                query: GetFaqDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }: { data: FaqType; error: HttpError }) => (
                <VitalityDetailsView details={formatFaqDetails(translate, data)} error={error} />
            )}
        />
    );
}
