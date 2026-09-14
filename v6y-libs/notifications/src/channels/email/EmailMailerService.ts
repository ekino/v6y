import nodemailer, { Transporter } from 'nodemailer';

import { AppLogger } from '@v6y/core-logic';

import EmailConfig from './EmailConfig.ts';

export interface MailMessage {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
}

let transporter: Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport(EmailConfig.buildMailTransportOptions());
    }

    return transporter;
};

/**
 * Send one email. Never throws: a delivery problem is reported as `false` and
 * logged so that a broken SMTP server never turns a successful audit into a
 * failed BullMQ job.
 */
const sendMail = async ({ to, subject, html, text }: MailMessage): Promise<boolean> => {
    if (!EmailConfig.isMailEnabled()) {
        AppLogger.info('[EmailMailerService] Mail delivery is not configured, email skipped.');
        return false;
    }

    if (!to?.length) {
        AppLogger.warn('[EmailMailerService] No recipient address, email skipped.');
        return false;
    }

    const recipients = Array.isArray(to) ? to.join(', ') : to;

    try {
        await getTransporter().sendMail({
            from: EmailConfig.getMailSender(),
            to,
            subject,
            text,
            html,
        });

        AppLogger.info(`[EmailMailerService] Email sent to ${recipients}: ${subject}`);
        return true;
    } catch (error) {
        AppLogger.error(`[EmailMailerService] Unable to send the email to ${recipients}: `, error);
        return false;
    }
};

const EmailMailerService = {
    sendMail,
};

export default EmailMailerService;
