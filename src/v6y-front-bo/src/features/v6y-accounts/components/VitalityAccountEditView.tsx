"use client";

import { Typography } from 'antd';
import {
    accountCreateEditItems,
    accountCreateOrEditFormInAdapter,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import CreateOrEditAccount from '../apis/createOrEditAccount';
import { useRole } from '../../../commons/hooks/useRole';

import { ApplicationType } from '@v6y/commons/src/types/ApplicationType';
import { useEffect, useState } from 'react';
import { useParsed } from '@refinedev/core';
import GetApplicationList from '../../../commons/apis/getApplicationList';
import GetAccountDetailsByParams from '../apis/getAccountDetailsByParams';
import React from 'react';

export default function VitalityAccountEditView() {
    const { translate } = useTranslation();
    const [userRole, setUserRole] = useState<string | null>(null);
    const { getRole } = useRole();
    const { id } = useParsed();

    useEffect(() => {
        setUserRole(getRole());
    }, [getRole]);

    if (!userRole) {
        return <VitalityEmptyView />;
    }

    return (
        <RefineSelectWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-accounts.titles.edit')}
                </Typography.Title>
            }
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
                resource: 'getApplicationList',
                query: GetApplicationList,
            }}

            renderSelectOption={(applications: ApplicationType[]) => {
                return accountCreateEditItems(translate, userRole, applications)
            }}
        />
    );
}