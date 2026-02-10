import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { Matcher } from '@v6y/core-logic/src/utils';
import { AdminHttpError } from '@v6y/ui-kit/api/types/AdminHttpError';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider';

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
