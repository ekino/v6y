import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { AlertTriangle, Check, toast } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { buildClientQuery } from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationLatestAuditRunByParams from '../api/getApplicationLatestAuditRunByParams';
import TriggerApplicationAnalysis from '../api/triggerApplicationAnalysis';

const AUDIT_RUN_POLL_INTERVAL_MS = 4000;
const AUDIT_RUN_POLL_MAX_ATTEMPTS = 45;
const AUDIT_RUN_SETTLED_STATUSES = new Set(['completed', 'error', 'failed']);

export const auditToastStyle = {
    background: 'rgba(255, 255, 255, 0.96)',
    color: '#111827',
    border: '1px solid rgba(17, 24, 39, 0.15)',
};

/**
 * Encapsulates the "run an audit now" action: triggers the analysis via the BFF,
 * then polls the latest audit run for the application until it settles
 * (completed/error/failed), alerting the user via toast along the way.
 */
export const useRunApplicationAudit = (applicationId?: number, onAuditCompleted?: () => void) => {
    const { translate } = useTranslationProvider();
    const [isRunningAudit, setIsRunningAudit] = React.useState(false);

    const isMountedRef = React.useRef(true);
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const pollAuditRunStatus = React.useCallback(
        async (targetId: number, loadingToastId: string | number) => {
            for (let attempt = 0; attempt < AUDIT_RUN_POLL_MAX_ATTEMPTS; attempt += 1) {
                await new Promise((resolve) => setTimeout(resolve, AUDIT_RUN_POLL_INTERVAL_MS));

                if (!isMountedRef.current) {
                    return;
                }

                try {
                    const response = await buildClientQuery<{
                        getApplicationLatestAuditRunByParams: {
                            runStatus: string;
                            errorMessage: string | null;
                        } | null;
                    }>({
                        queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                        query: GetApplicationLatestAuditRunByParams,
                        variables: {
                            _id: targetId,
                        },
                    });

                    const latestRun = response?.getApplicationLatestAuditRunByParams;
                    const runStatus = latestRun?.runStatus;

                    if (!runStatus || !AUDIT_RUN_SETTLED_STATUSES.has(runStatus)) {
                        continue;
                    }

                    if (!isMountedRef.current) {
                        return;
                    }

                    if (runStatus === 'completed') {
                        toast.success(translate('vitality.appDetailsPage.auditToasts.completed'), {
                            id: loadingToastId,
                            style: auditToastStyle,
                            icon: <Check className="w-4 h-4 text-emerald-600" />,
                        });
                        onAuditCompleted?.();
                    } else {
                        toast.error(
                            latestRun?.errorMessage ||
                                translate('vitality.appDetailsPage.auditToasts.jobFailed'),
                            {
                                id: loadingToastId,
                                style: auditToastStyle,
                                icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
                            },
                        );
                    }

                    setIsRunningAudit(false);
                    return;
                } catch (error) {
                    console.error('Error polling audit run status:', error);
                }
            }

            if (!isMountedRef.current) {
                return;
            }

            toast.message(translate('vitality.appDetailsPage.auditToasts.stillRunning'), {
                id: loadingToastId,
                style: auditToastStyle,
            });
            setIsRunningAudit(false);
        },
        [translate, onAuditCompleted],
    );

    const onRunAuditClicked = React.useCallback(async () => {
        if (!applicationId || Number.isNaN(applicationId)) {
            toast.error(translate('vitality.appDetailsPage.auditToasts.invalidApplication'), {
                style: auditToastStyle,
            });
            console.error('Unable to trigger audit: invalid application id');
            return;
        }

        const loadingToastId = toast.loading(
            translate('vitality.appDetailsPage.auditToasts.running'),
            {
                style: auditToastStyle,
            },
        );

        setIsRunningAudit(true);
        try {
            const response = await buildClientQuery<{
                triggerApplicationAnalysis: {
                    success: boolean;
                    applicationId: number;
                    message: string;
                };
            }>({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: TriggerApplicationAnalysis,
                variables: {
                    applicationId,
                },
            });

            if (!response?.triggerApplicationAnalysis?.success) {
                throw new Error(
                    response?.triggerApplicationAnalysis?.message || 'Unable to trigger the audit',
                );
            }

            toast.success(translate('vitality.appDetailsPage.auditToasts.queued'), {
                id: loadingToastId,
                style: auditToastStyle,
            });

            // Keep polling so the user is alerted when the queued audit actually
            // finishes (or fails), not just when it has been accepted.
            void pollAuditRunStatus(applicationId, loadingToastId);
        } catch (error) {
            toast.error(translate('vitality.appDetailsPage.auditToasts.failed'), {
                id: loadingToastId,
                style: auditToastStyle,
            });
            console.error('Error running audit:', error);
            setIsRunningAudit(false);
        }
    }, [applicationId, translate, pollAuditRunStatus]);

    return { isRunningAudit, onRunAuditClicked };
};

export default useRunApplicationAudit;
