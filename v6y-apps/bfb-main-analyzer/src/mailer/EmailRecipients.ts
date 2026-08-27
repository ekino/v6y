/**
 * A project's contact mail is a free-text field that can list several
 * addresses, so a single audit notification is expected to reach more than one
 * inbox. These helpers turn that raw field into a clean, de-duplicated list and
 * merge it with the owner account address.
 */

// Intentionally permissive: it only rejects the obviously malformed so a typo
// never silently drops a whole project's contact list.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Split a contact-mail field (comma or semicolon separated) into the individual
 * addresses it actually holds, dropping blanks and anything that isn't an email.
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

/**
 * Keep the first occurrence of each address, comparing case-insensitively so the
 * same inbox written two different ways is not mailed twice.
 */
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
