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
            <section className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fa_100%)] px-5 py-5 shadow-sm md:px-6">
                <div className="max-w-3xl space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                        Keep answers close to the reports people are trying to read.
                    </h1>
                    <p className="text-sm leading-6 text-slate-600 md:text-base">
                        This space should explain how Vitality reports work, what the main indicators mean, and where to go when a project needs follow-up.
                    </p>
                </div>
            </section>

            {hasEntries ? (
                <VitalityFaqList dataSource={dataSource} />
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center shadow-sm">
                    <p className="text-lg font-semibold text-slate-900">FAQ content is unavailable right now.</p>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Vitality should still help users understand the product even when the backend is unavailable. Reconnect the data source or direct users to the team for immediate support.
                    </p>
                </div>
            )}

            <div className="flex w-full justify-end">
                <Link className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50" href="/contact">
                    {translate('vitality.appListPage.contactEmail')}
                </Link>
            </div>
        </div>
    );
};

export default VitalityFaqView;
