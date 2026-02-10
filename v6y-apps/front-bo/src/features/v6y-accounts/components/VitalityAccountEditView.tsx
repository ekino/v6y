'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import AdminSelectWrapper from '@v6y/ui-kit/components/organisms/admin/AdminSelectWrapper';
import EmptyView from '@v6y/ui-kit/components/organisms/app/EmptyView';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import GetApplicationListByPageAndParams from '../../../commons/apis/getApplicationListByPageAndParams';
import {
    accountCreateEditItems,
    accountCreateOrEditFormInAdapter,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useRole } from '../../../commons/hooks/useRole';
import CreateOrEditAccount from '../apis/createOrEditAccount';
import GetAccountDetailsByParams from '../apis/getAccountDetailsByParams';

export default function VitalityAccountEditView() {
    const { translate } = useTranslationProvider();
    const [userRole, setUserRole] = useState<string | null>(null);
    const { getRole } = useRole();
    const { id } = useAdminNavigationParamsParser();

    useEffect(() => {
        setUserRole(getRole());
    }, [getRole]);

    if (!userRole) {
        return <EmptyView />;
    }

    return (
        <AdminSelectWrapper
            title={<TitleView title={translate('v6y-accounts.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: accountCreateOrEditFormInAdapter,
                query: GetAccountDetailsByParams,
                queryResource: 'getAccountDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editResource: 'createOrEditAccount',
                editFormAdapter: accountCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditAccount,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            selectOptions={{
                resource: 'getApplicationListByPageAndParams',
                query: GetApplicationListByPageAndParams,
            }}
            renderSelectOption={(applications) => {
                return accountCreateEditItems(
                    translate,
                    userRole,
                    applications as ApplicationType[],
                    true,
                );
            }}
        />
    );
}
