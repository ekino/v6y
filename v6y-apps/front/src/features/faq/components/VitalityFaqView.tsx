'use client';

import Link from 'next/link';
import * as React from 'react';

import { FaqType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetFaqListByPageAndParams from '../api/getFaqListByPageAndParams';
import VitalityFaqList from './VitalityFaqList';

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
    const hasEntries = Boolean(dataSource?.length);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                    {translate('vitality.faqPage.pageTitle')}
                </h1>
                <Link
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                    href="/contact"
                >
                    {translate('vitality.appListPage.contactEmail')}
                </Link>
            </div>

            {hasEntries ? (
                <VitalityFaqList dataSource={dataSource} />
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
                    <p className="text-lg font-semibold text-slate-900">
                        {translate('vitality.faqPage.emptyTitle')}
                    </p>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {translate('vitality.faqPage.emptyDescription')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VitalityFaqView;
