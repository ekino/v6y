'use client';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { AdminSelectWrapper, EmptyView, TitleView, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';
import { useEffect, useState } from 'react';

import GetApplicationListByPageAndParams from '../../../commons/apis/getApplicationListByPageAndParams';
import {
    accountCreateEditItems,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useRole } from '../../../commons/hooks/useRole';
import CreateOrEditAccount from '../apis/createOrEditAccount';

export default function VitalityAccountCreateView() {
    const { translate } = useTranslationProvider();
    const [userRole, setUserRole] = useState<string | null>(null);
    const { getRole } = useRole();

    useEffect(() => {
        setUserRole(getRole());
    }, [getRole]);

    if (!userRole) {
        return <EmptyView />;
    }

    return (
        <AdminSelectWrapper
            title={<TitleView title={translate('v6y-accounts.titles.create')} />}
            createOptions={{
                createResource: 'createOrEditAccount',
                createFormAdapter: accountCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditAccount,
                createQueryParams: {},
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
                );
            }}
        />
    );
}
