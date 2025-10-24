'use client';

import { FaqType } from '@v6y/core-logic/src/types';
import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit-front';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetFaqListByPageAndParams from '../api/getFaqListByPageAndParams';
import VitalityFaqList from './VitalityFaqList';
import Link from 'next/link';

const VitalityFaqView = () => {
    const { translate } = useTranslationProvider();
    const { data } = useClientQuery<{ getFaqListByPageAndParams: FaqType[] }>({
        queryCacheKey: ['getFaqListByPageAndParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetFaqListByPageAndParams,
                variables: {},
            }),
    });

    const dataSource = data?.getFaqListByPageAndParams;

    return (
        <div className="space-y-8">
            <VitalityFaqList dataSource={dataSource} />
            <div className="w-full flex justify-end">
                <Link className="text-black" href='/contact'>{ translate('vitality.appListPage.contactEmail') }</Link>
            </div>
        </div>
    );
};

export default VitalityFaqView;
