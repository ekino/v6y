import { useParsed } from '@refinedev/core';
import { DeprecatedDependencyType } from '@v6y/core-logic/src';
import { VitalityTitle } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDeprecatedDependencyDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams';

export default function VitalityDeprecatedDependencyDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-audit-helps.titles.show" />}
            queryOptions={{
                resource: 'getDeprecatedDependencyDetailsByParams',
                query: GetDeprecatedDependencyDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDeprecatedDependencyDetails(
                        translate,
                        data as DeprecatedDependencyType,
                    )}
                    error={error}
                />
            )}
        />
    );
}
