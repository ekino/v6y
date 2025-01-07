import { HttpError, useParsed } from '@refinedev/core';
import { ApplicationType } from '@v6y/commons';
import Matcher from '@v6y/commons/src/core/Matcher';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import VitalityTitle from '../../../commons/components/VitalityTitle';
import { formatApplicationDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetApplicationDetails from '../apis/getApplicationDetails';

export default function VitalityApplicationDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    const renderShowView: ({
        data,
        error,
    }: {
        data?: unknown;
        error: HttpError | string | undefined;
    }) => React.JSX.Element = ({ data, error }) => {
        const errorMessage = Matcher()
            .on(
                () => (error as HttpError)?.message?.length > 0,
                () => (error as HttpError)?.message,
            )
            .on(
                () => typeof error === 'string',
                () => error,
            )
            .otherwise(() => '');
        return (
            <VitalityDetailsView
                details={formatApplicationDetails(translate, data as ApplicationType)}
                error={errorMessage as string}
            />
        );
    };

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-applications.titles.show" />}
            queryOptions={{
                resource: 'getApplicationDetailsInfoByParams',
                query: GetApplicationDetails,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={renderShowView}
        />
    );
}
