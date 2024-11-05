"use client";

import { Typography } from 'antd';
import {
    accountCreateEditItems,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
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
        // fallback view (EmptyView)
        return null;
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
                // TODO: dans config
                const applicationsValues = applications?.map((application: ApplicationType) => ({
                    value: application._id,
                    label: application.name,
                }));

                return accountCreateEditItems(translate, userRole, applicationsValues)
            }}
        />
    );
}