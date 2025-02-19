import { HttpError, useParsed } from '@refinedev/core';
import { AccountType } from '@v6y/core-logic';
import Matcher from '@v6y/core-logic/src/core/Matcher';
import { VitalityTitle, useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAccountDetails } from '../../../commons/config/VitalityDetailsConfig';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetAccountDetailsByParams from '../apis/getAccountDetailsByParams';

export default function VitalityAccountDetailsView() {
    const { translate } = useTranslationProvider();

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
                details={formatAccountDetails(translate, data as AccountType)}
                error={errorMessage as string}
            />
        );
    };

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-account.titles.show" />}
            queryOptions={{
                resource: 'getAccountDetailsByParams',
                query: GetAccountDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={renderShowView}
        />
    );
}
