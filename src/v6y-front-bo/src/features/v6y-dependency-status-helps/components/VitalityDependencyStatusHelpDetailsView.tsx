import { useParsed } from '@refinedev/core';
import { DependencyStatusHelpType } from '@v6y/commons/src';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDependencyStatusHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams';

export default function VitalityDependencyStatusHelpDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-dependency-status-helps.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getDependencyStatusHelpDetailsByParams',
                query: GetDependencyStatusHelpDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDependencyStatusHelpDetails(
                        translate,
                        data as DependencyStatusHelpType,
                    )}
                    error={error}
                />
            )}
        />
    );
}
