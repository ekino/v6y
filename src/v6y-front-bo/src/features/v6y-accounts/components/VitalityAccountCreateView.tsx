'use client';

import { ApplicationType } from '@v6y/commons/src/types/ApplicationType';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';

import GetApplicationListByPageAndParams from '../../../commons/apis/getApplicationListByPageAndParams';
import VitalityEmptyView from '../../../commons/components/VitalityEmptyView';
import {
    accountCreateEditItems,
    accountCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useRole } from '../../../commons/hooks/useRole';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineSelectWrapper from '../../../infrastructure/components/RefineSelectWrapper';
import CreateOrEditAccount from '../apis/createOrEditAccount';

export default function VitalityAccountCreateView() {
    const { translate } = useTranslation();
    const [userRole, setUserRole] = useState<string | null>(null);
    const { getRole } = useRole();

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
                    {translate('v6y-accounts.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                createResource: 'createOrEditAccount',
                createFormAdapter: accountCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditAccount,
                createQueryParams: {},
            }}
            selectOptions={{
                resource: 'getApplicationListByPageAndParams',
                query: GetApplicationListByPageAndParams,
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            renderSelectOption={(applications: ApplicationType[]) => {
                return accountCreateEditItems(translate, userRole, applications);
            }}
        />
    );
}
