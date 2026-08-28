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
 *
 * Also checks if the application creation/edit itself failed (null response),
 * which typically indicates validation errors (duplicate name/acronym, missing fields, etc).
 */
export const notifyAuditFrequencyScheduleOutcome = (data: unknown, translate: TranslateType) => {
    // refine hands over whatever the mutation function resolved to, which is the
    // raw GraphQL payload — read through an extra `data` level in case a future
    // data provider normalizes it.
    const payload = data as
        | (CreateOrEditApplicationPayload & { data?: CreateOrEditApplicationPayload })
        | undefined;
    const application = payload?.createOrEditApplication || payload?.data?.createOrEditApplication;

    // Check if the mutation failed entirely (null/undefined application)
    if (application === null || application === undefined) {
        Message.error(
            translate('v6y-applications.messages.creation-failed') ||
                'Failed to save application. Please check the form fields (duplicate name/acronym?) and try again.',
        );
        return;
    }

    if (application?.auditFrequencyScheduled === false) {
        Message.warning(translate('v6y-applications.messages.audit-frequency-schedule-failed'));
    }
};
