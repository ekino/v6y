import MailConfig from './EmailConfig.ts';

export interface AuditScoreBreakdown {
    total: number;
    success: number;
    warning: number;
    error: number;
}

export interface AuditRunCompletedEmailParams {
    username: string;
    applicationId: number;
    applicationName: string;
    auditRunId: number;
    runStatus: string;
    branch?: string | null;
    errorMessage?: string | null;
    scores: AuditScoreBreakdown;
}

export interface DailyDigestApplicationSummary {
    applicationId: number;
    applicationName: string;
    runCount: number;
    completedCount: number;
    failedCount: number;
    scores: AuditScoreBreakdown;
}

export interface DailyDigestEmailParams {
    username: string;
    date: Date;
    applications: DailyDigestApplicationSummary[];
}

/**
 * Application names, branches and analyzer error messages all end up inside the
 * HTML body, and none of them are trusted input, so every interpolated value
 * goes through here.
 */
const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const buildApplicationUrl = (applicationId: number) => {
    const baseUrl = MailConfig.getPublicAppUrl();
    return baseUrl ? `${baseUrl}/app/${applicationId}` : '';
};

const buildAuditRunUrl = (applicationId: number, auditRunId: number) => {
    const baseUrl = MailConfig.getPublicAppUrl();
    return baseUrl ? `${baseUrl}/app/${applicationId}/reports/${auditRunId}` : '';
};

const buildLinkHtml = (url: string, label: string) =>
    url
        ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(url)}" style="background:#0f172a;border-radius:8px;color:#ffffff;display:inline-block;padding:10px 18px;text-decoration:none;">${escapeHtml(label)}</a></p>`
        : '';

const buildLayoutHtml = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html lang="en">
    <body style="background:#f8fafc;font-family:Helvetica,Arial,sans-serif;margin:0;padding:24px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;color:#0f172a;margin:0 auto;max-width:600px;padding:32px;">
            <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(title)}</h1>
            ${bodyHtml}
            <p style="border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;margin:32px 0 0;padding-top:16px;">
                You receive this email because you own this application on Vitality.
                You can turn these emails off from your notification settings.
            </p>
        </div>
    </body>
</html>`;

const formatScores = ({ total, success, warning, error }: AuditScoreBreakdown) =>
    `${total} audit(s): ${success} ok, ${warning} to watch, ${error} critical`;

const buildAuditRunCompletedEmail = ({
    username,
    applicationId,
    applicationName,
    auditRunId,
    runStatus,
    branch,
    errorMessage,
    scores,
}: AuditRunCompletedEmailParams) => {
    const succeeded = runStatus === 'completed';
    const subject = succeeded
        ? `[Vitality] Audit report ready for ${applicationName}`
        : `[Vitality] Audit failed for ${applicationName}`;

    const url = buildAuditRunUrl(applicationId, auditRunId);

    const details = [
        `Application: ${applicationName}`,
        branch?.length ? `Branch: ${branch}` : null,
        `Status: ${runStatus}`,
        `Results: ${formatScores(scores)}`,
        !succeeded && errorMessage?.length ? `Error: ${errorMessage}` : null,
    ].filter((line): line is string => !!line);

    const text = [
        `Hi ${username},`,
        '',
        succeeded
            ? 'The audit run you requested has finished. Here is the summary:'
            : 'The audit run you requested did not finish successfully:',
        '',
        ...details,
        '',
        url ? `See the full report: ${url}` : '',
    ]
        .join('\n')
        .trim();

    const html = buildLayoutHtml(
        subject.replace('[Vitality] ', ''),
        `
            <p style="margin:0 0 16px;">Hi ${escapeHtml(username)},</p>
            <p style="margin:0 0 16px;">${
                succeeded
                    ? 'The audit run you requested has finished.'
                    : 'The audit run you requested did not finish successfully.'
            }</p>
            <ul style="margin:0;padding-left:20px;">
                ${details.map((line) => `<li style="margin:4px 0;">${escapeHtml(line)}</li>`).join('')}
            </ul>
            ${buildLinkHtml(url, 'See the full report')}
        `,
    );

    return { subject, text, html };
};

const buildDailyDigestEmail = ({ username, date, applications }: DailyDigestEmailParams) => {
    const day = date.toISOString().slice(0, 10);
    const subject = `[Vitality] Daily audit digest - ${day}`;

    const lines = applications.map(
        ({ applicationName, runCount, completedCount, failedCount, scores }) =>
            `${applicationName}: ${runCount} run(s), ${completedCount} completed, ${failedCount} failed - ${formatScores(scores)}`,
    );

    const text = [
        `Hi ${username},`,
        '',
        `Here is what happened on your applications on ${day}:`,
        '',
        ...lines.map((line) => `- ${line}`),
        '',
        MailConfig.getPublicAppUrl()
            ? `Open Vitality: ${MailConfig.getPublicAppUrl()}/dashboard`
            : '',
    ]
        .join('\n')
        .trim();

    const rowsHtml = applications
        .map(
            ({ applicationId, applicationName, runCount, completedCount, failedCount, scores }) => {
                const url = buildApplicationUrl(applicationId);
                const name = url
                    ? `<a href="${escapeHtml(url)}" style="color:#0f172a;">${escapeHtml(applicationName)}</a>`
                    : escapeHtml(applicationName);

                return `
                    <tr>
                        <td style="border-top:1px solid #e2e8f0;padding:12px 0;">
                            <strong>${name}</strong><br />
                            <span style="color:#475569;font-size:13px;">
                                ${runCount} run(s), ${completedCount} completed, ${failedCount} failed<br />
                                ${escapeHtml(formatScores(scores))}
                            </span>
                        </td>
                    </tr>`;
            },
        )
        .join('');

    const html = buildLayoutHtml(
        `Daily audit digest - ${day}`,
        `
            <p style="margin:0 0 16px;">Hi ${escapeHtml(username)},</p>
            <p style="margin:0 0 8px;">Here is what happened on your applications:</p>
            <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
            ${buildLinkHtml(
                MailConfig.getPublicAppUrl() ? `${MailConfig.getPublicAppUrl()}/dashboard` : '',
                'Open Vitality',
            )}
        `,
    );

    return { subject, text, html };
};

const EmailTemplates = {
    buildAuditRunCompletedEmail,
    buildDailyDigestEmail,
};

export default EmailTemplates;
