import { ApplicationType } from '@v6y/core-logic/src/types';
import { Matcher } from '@v6y/core-logic/src/utils';
import {
    AdminHttpError,
    AdminShowWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatApplicationDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetApplicationDetails from '../apis/getApplicationDetails';

export default function VitalityApplicationDetailsView() {
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
                details={formatApplicationDetails(translate, data as ApplicationType)}
                error={errorMessage as string}
            />
        );
    };

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-applications.titles.show')} />}
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
