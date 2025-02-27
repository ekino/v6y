import { AccountType } from '@v6y/core-logic/src/types';
import { Matcher } from '@v6y/core-logic/src/utils';
import {
    AdminHttpError,
    AdminShowWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAccountDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetAccountDetailsByParams from '../apis/getAccountDetailsByParams';

export default function VitalityAccountDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    const renderShowView: ({
        data,
        error,
    }: {
        data?: unknown;
        error?: AdminHttpError;
    }) => React.JSX.Element = ({ data, error }) => {
        const errorMessage = Matcher()
            .on(
                () => (error as AdminHttpError)?.message?.length > 0,
                () => (error as AdminHttpError)?.message,
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
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-account.titles.show')} />}
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
