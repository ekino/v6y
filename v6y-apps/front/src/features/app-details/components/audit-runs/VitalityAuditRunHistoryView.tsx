'use client';

import React from 'react';

import { useNavigationAdapter } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityNavigationPaths from '../../../../commons/config/VitalityNavigationPaths';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetAllAuditRuns from '../../api/getAllAuditRuns.ts';
import GetApplicationAuditRuns from '../../api/getApplicationAuditRuns.ts';
import VitalityAuditRunHistory from './VitalityAuditRunHistory.tsx';

interface VitalityAuditRunHistoryViewProps {
    applicationId?: number;
    onRunClick?: (runId: number) => void;
    source?: string;
}

interface AuditRunType {
    _id: number;
    appId: number;
    branch: string | null;
    runStatus: string;
    analysisTypes: string[];
    triggeredAt: string;
    completedAt: string | null;
    errorMessage: string | null;
    audits: Array<{
        _id: number;
        type: string;
        category: string;
    }>;
}

export const VitalityAuditRunHistoryView: React.FC<VitalityAuditRunHistoryViewProps> = ({
    applicationId,
    onRunClick,
    source,
}) => {
    const { router } = useNavigationAdapter();
    const isAppSpecific = Number.isFinite(applicationId);
    const targetApplicationId = isAppSpecific ? Number(applicationId) : undefined;
    const cacheKey = isAppSpecific
        ? ['getApplicationAuditRunsByParams', `${targetApplicationId}`]
        : ['getAllAuditRuns'];

    const { isLoading, data, error } = useClientQuery<{
        getApplicationAuditRunsByParams?: AuditRunType[];
        getAllAuditRuns?: AuditRunType[];
    }>({
        queryCacheKey: cacheKey,
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: isAppSpecific ? GetApplicationAuditRuns : GetAllAuditRuns,
                variables: isAppSpecific ? { _id: targetApplicationId } : {},
            }),
    });

    React.useEffect(() => {
        console.log('[VitalityAuditRunHistoryView]', {
            applicationId,
            isLoading,
            dataLength: isAppSpecific
                ? data?.getApplicationAuditRunsByParams?.length
                : data?.getAllAuditRuns?.length,
            data,
            error,
        });
    }, [applicationId, isLoading, data, error, isAppSpecific]);

    if (error) {
        console.error('[VitalityAuditRunHistoryView] Error fetching audit runs:', error);
        return (
            <div className="w-full p-4 sm:p-6 text-center text-red-500">
                Failed to load audit history
            </div>
        );
    }

    const auditRuns = isAppSpecific
        ? data?.getApplicationAuditRunsByParams || []
        : data?.getAllAuditRuns || [];

    const handleRunClick = (runId: number) => {
        if (onRunClick) {
            onRunClick(runId);
            return;
        }

        if (!applicationId) {
            return;
        }

        const targetUrl = source
            ? `${VitalityNavigationPaths.APP}/${targetApplicationId}/reports/${runId}?source=${source}`
            : `${VitalityNavigationPaths.APP}/${targetApplicationId}/reports/${runId}`;
        router.push(targetUrl);
    };

    return (
        <VitalityAuditRunHistory
            auditRuns={auditRuns}
            isLoading={isLoading}
            onRunClick={isAppSpecific ? handleRunClick : undefined}
        />
    );
};

export default VitalityAuditRunHistoryView;
