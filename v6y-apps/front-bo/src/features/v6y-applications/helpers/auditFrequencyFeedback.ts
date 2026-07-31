import { Message, TranslateType } from '@v6y/ui-kit';

interface CreateOrEditApplicationPayload {
    createOrEditApplication?: {
        auditFrequencyScheduled?: boolean | null;
    } | null;
}

/**
 * The application row is saved before its schedule is pushed to the analyzer, and
 * that push can fail on its own (analyzer down, queue unavailable, schedule API
 * path not configured). Without this, such a save reported a plain success while
 * the scheduled audits it enabled were not actually installed.
 *
 * The mutation reports the outcome through `auditFrequencyScheduled`; only an
 * explicit `false` is a failure, since the field is absent for clients that do
 * not select it.
 */
export const notifyAuditFrequencyScheduleOutcome = (data: unknown, translate: TranslateType) => {
    // refine hands over whatever the mutation function resolved to, which is the
    // raw GraphQL payload — read through an extra `data` level in case a future
    // data provider normalizes it.
    const payload = data as
        | (CreateOrEditApplicationPayload & { data?: CreateOrEditApplicationPayload })
        | undefined;
    const application = payload?.createOrEditApplication || payload?.data?.createOrEditApplication;

    if (application?.auditFrequencyScheduled === false) {
        Message.warning(translate('v6y-applications.messages.audit-frequency-schedule-failed'));
    }
};
