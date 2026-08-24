/**
 * SMTP settings for the audit notification emails.
 *
 * Notifications are opt-in at the infrastructure level: with no SMTP host
 * configured the analyzer keeps running exactly as before and simply skips the
 * sending step, so a deployment that does not want emails has nothing to turn
 * off.
 */
const isMailEnabled = () =>
    process.env.V6Y_MAIL_ENABLED !== 'false' && !!process.env.V6Y_MAIL_SMTP_HOST?.length;

const buildMailTransportOptions = () => {
    const port = parseInt(process.env.V6Y_MAIL_SMTP_PORT || '587', 10);
    const user = process.env.V6Y_MAIL_SMTP_USER;
    const pass = process.env.V6Y_MAIL_SMTP_PASSWORD;

    return {
        host: process.env.V6Y_MAIL_SMTP_HOST as string,
        port,
        // Implicit TLS is the rule on 465 only; everything else starts in clear
        // and upgrades through STARTTLS.
        secure: process.env.V6Y_MAIL_SMTP_SECURE
            ? process.env.V6Y_MAIL_SMTP_SECURE === 'true'
            : port === 465,
        ...(user?.length && pass?.length ? { auth: { user, pass } } : {}),
    };
};

const getMailSender = () => process.env.V6Y_MAIL_FROM || 'Vitality <no-reply@v6y.local>';

/**
 * Public origin the emails link back to. Without it the emails still make sense,
 * they just carry no deep links rather than links to `undefined`.
 */
const getPublicAppUrl = () => process.env.V6Y_PUBLIC_APP_URL?.replace(/\/+$/, '') || '';

/**
 * Cron pattern of the daily digest. Six fields, matching the audit schedules, so
 * the seconds field pins the exact firing time.
 */
const getDailyDigestCron = () => process.env.V6Y_DAILY_DIGEST_CRON || '0 0 8 * * *';

const getDailyDigestTimezone = () => process.env.V6Y_AUDIT_SCHEDULE_TIMEZONE || 'UTC';

const MailConfig = {
    isMailEnabled,
    buildMailTransportOptions,
    getMailSender,
    getPublicAppUrl,
    getDailyDigestCron,
    getDailyDigestTimezone,
};

export default MailConfig;
