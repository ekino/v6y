'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { Spinner, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetAllAuditRuns from '../../app-details/api/getAllAuditRuns';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';
import { VitalityAppGlobalFilters } from '../types/VitalityAppGlobalFilters';
import VitalityAppListHeader from './VitalityAppListHeader';
import VitalityAppListPagination from './VitalityAppListPagination';

interface AuditRunSummary {
    _id: number;
    appId: number;
    triggeredAt: string;
}

const matchesDateRange = (
    value: string | Date | undefined,
    from?: string,
    to?: string,
): boolean => {
    if (!from && !to) return true;
    if (!value) return false;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    if (from) {
        const fromDate = new Date(`${from}T00:00:00`);
        if (date < fromDate) return false;
    }

    if (to) {
        const toDate = new Date(`${to}T23:59:59`);
        if (date > toDate) return false;
    }

    return true;
};

const VitalityAppList: React.FC<{ source?: string; filters?: VitalityAppGlobalFilters }> = ({
    source,
    filters,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const { getUrlParams } = useNavigationAdapter();
    const [, searchText] = getUrlParams(['keywords', 'searchText']);

    const {
        data: dataAppList,
        isLoading: isAppListLoading,
        isFetching: isAppListFetching,
    } = useClientQuery<{
        getApplicationListByPageAndParams: ApplicationType[];
    }>({
        queryCacheKey: [
            'getApplicationListByPageAndParams',
            searchText?.length ? searchText : 'empty_search_text',
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
                query: GetApplicationListByPageAndParams,
                variables: {
                    offset: 0,
                    limit: 1000,
                    searchText,
                },
            }),
    });

    const { data: dataAuditRuns, isLoading: isAuditRunsLoading } = useClientQuery<{
        getAllAuditRuns: AuditRunSummary[];
    }>({
        queryCacheKey: ['getAllAuditRuns-app-list'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
                query: GetAllAuditRuns,
                variables: {},
            }),
    });

    const reportsCountByApp = useMemo(() => {
        const counts = new Map<number, number>();
        (dataAuditRuns?.getAllAuditRuns || []).forEach((run) => {
            counts.set(run.appId, (counts.get(run.appId) || 0) + 1);
        });
        return counts;
    }, [dataAuditRuns?.getAllAuditRuns]);

    const filteredAppList = useMemo(() => {
        const allApps = dataAppList?.getApplicationListByPageAndParams || [];
        return allApps.filter((app) => {
            const reportsCount = reportsCountByApp.get(app._id) || 0;
            const branchesCount = app.repo?.allBranches?.length || 0;

            if (
                filters?.minReports !== undefined &&
                Number.isFinite(filters.minReports) &&
                reportsCount < filters.minReports
            ) {
                return false;
            }

            if (
                filters?.maxReports !== undefined &&
                Number.isFinite(filters.maxReports) &&
                reportsCount > filters.maxReports
            ) {
                return false;
            }

            if (
                filters?.minBranches !== undefined &&
                Number.isFinite(filters.minBranches) &&
                branchesCount < filters.minBranches
            ) {
                return false;
            }

            if (
                filters?.maxBranches !== undefined &&
                Number.isFinite(filters.maxBranches) &&
                branchesCount > filters.maxBranches
            ) {
                return false;
            }

            return matchesDateRange(app.createdAt, filters?.createdFrom, filters?.createdTo);
        });
    }, [dataAppList?.getApplicationListByPageAndParams, filters, reportsCountByApp]);

    const totalCount = filteredAppList.length;
    const totalPages = Math.ceil(totalCount / VitalityApiConfig.VITALITY_BFF_PAGE_SIZE);
    const pageStart = (currentPage - 1) * VitalityApiConfig.VITALITY_BFF_PAGE_SIZE;
    const pageEnd = pageStart + VitalityApiConfig.VITALITY_BFF_PAGE_SIZE;
    const paginatedAppList = filteredAppList.slice(pageStart, pageEnd);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, filters]);

    const isLoading = isAppListLoading || isAppListFetching || isAuditRunsLoading;
    const addApplicationUrl = VitalityApiConfig.VITALITY_FRONT_BO_URL;

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const { translate } = useTranslationProvider();

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <VitalityAppListHeader appsTotal={totalCount} addApplicationUrl={addApplicationUrl} />

            {isLoading && !dataAppList ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : filteredAppList.length === 0 ? (
                <div className="w-full max-w-4xl px-4 py-20 text-center text-zinc-500">
                    {translate('vitality.appListPage.empty')}
                </div>
            ) : (
                <div className="w-full">
                    {paginatedAppList && (
                        <ul className="space-y-4">
                            {paginatedAppList.map((app) => (
                                <VitalityAppInfos key={app._id} app={app} source={source} />
                            ))}
                        </ul>
                    )}

                    {totalPages > 1 && (
                        <VitalityAppListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalityAppList;
