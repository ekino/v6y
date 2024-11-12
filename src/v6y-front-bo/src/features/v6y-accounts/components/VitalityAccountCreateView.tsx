"use client";

import { Typography } from 'antd';
import {
    accountCreateEditItems,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import CreateOrEditAccount from '../apis/createOrEditAccount';
import { useRole } from '../../../commons/hooks/useRole';
import GetApplicationList from '../../../commons/apis/getApplicationList';
import { ApplicationType } from '@v6y/commons/src/types/ApplicationType';
import { useEffect, useState } from 'react';

export default function VitalityAccountCreateView() {
    const { translate } = useTranslation();
    const [userRole, setUserRole] = useState<string | null>(null);
    const { getRole } = useRole();

    useEffect(() => {
        setUserRole(getRole());
    }, [getRole]);

    console.log(userRole);

    if (!userRole) {
        return <VitalityEmptyView />;
    }

    return (
        <RefineSelectWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-accounts.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createResource: 'createOrEditAccount',
                createFormAdapter: accountCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditAccount,
                createQueryParams: {},
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