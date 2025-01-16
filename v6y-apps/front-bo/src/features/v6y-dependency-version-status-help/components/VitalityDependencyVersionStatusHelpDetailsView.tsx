import { useParsed } from '@refinedev/core';
import { DependencyVersionStatusHelpType } from '@v6y/core-logic/src';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDependencyVersionStatusHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetDependencyVersionStatusHelpDetailsByParams from '../apis/getDependencyVersionStatusHelpDetailsByParams';

export default function VitalityDependencyVersionStatusHelpDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-dependency-version-status-help.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getDependencyVersionStatusHelpDetailsByParams',
                query: GetDependencyVersionStatusHelpDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDependencyVersionStatusHelpDetails(
                        translate,
                        data as DependencyVersionStatusHelpType,
                    )}
                    error={error}
                />
            )}
        />
    );
}
