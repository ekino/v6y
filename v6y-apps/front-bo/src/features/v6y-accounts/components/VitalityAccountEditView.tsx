'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import {
    AdminSelectWrapper,
    EmptyView,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/ui-kit';

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
