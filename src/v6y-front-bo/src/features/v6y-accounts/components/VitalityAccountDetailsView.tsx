import { HttpError, useParsed } from '@refinedev/core';
import { AccountType } from '@v6y/commons';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAccountDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import {Matcher} from '@v6y/commons';
import GetAccountDetailsByParams from '../apis/getAccountDetailsByParams';

export default function VitalityAccountDetailsView() {
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
                details={formatAccountDetails(translate, data as AccountType)}
                error={errorMessage as string}
            />
        );
    };

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-account.titles.show')}
                </Typography.Title>
            }
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
