/**
 * Helpers to build a clean, de-duplicated recipient list from a project's
 * contact-mail field and the owning account's address.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Split a contact-mail field (comma or semicolon separated) into individual
 * addresses, dropping blanks and anything that is not a valid email.
 */
export const parseEmailList = (raw?: string | null): string[] => {
    if (!raw?.length) {
        return [];
    }

    return raw
        .split(/[,;]+/)
        .map((entry) => entry.trim())
        .filter((entry) => EMAIL_PATTERN.test(entry));
};

const dedupeEmails = (emails: string[]): string[] => {
    const seen = new Set<string>();

    return emails.filter((email) => {
        const key = email.toLowerCase();

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

/**
 * The addressees of an audit notification: the owner account (unless it opted
 * out or has no address) followed by every address listed in the project's
 * contact mail.
 */
export const collectAuditRecipients = (
    owner: { email?: string | null; auditReportEmailsEnabled?: boolean | null } | null,
    contactMail?: string | null,
): string[] => {
    const recipients: string[] = [];

    if (owner?.email?.length && owner.auditReportEmailsEnabled) {
        recipients.push(owner.email);
    }

    recipients.push(...parseEmailList(contactMail));

    return dedupeEmails(recipients);
};
