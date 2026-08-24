import nodemailer, { Transporter } from 'nodemailer';

import { AppLogger } from '@v6y/core-logic';

import MailConfig from '../config/MailConfig.ts';

export interface MailMessage {
    to: string;
    subject: string;
    html: string;
    text: string;
}

let transporter: Transporter | null = null;

/**
 * One transporter for the whole process: nodemailer pools the SMTP connection,
 * so rebuilding it per message would reconnect on every audit.
 */
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport(MailConfig.buildMailTransportOptions());
    }

    return transporter;
};

/**
 * Send one email. Never throws: an unreachable SMTP server must not turn a
 * successful audit into a failed job, so a delivery problem is reported as
 * `false` and logged.
 */
const sendMail = async ({ to, subject, html, text }: MailMessage): Promise<boolean> => {
    if (!MailConfig.isMailEnabled()) {
        AppLogger.info('[MailerService] Mail delivery is not configured, email skipped.');
        return false;
    }

    if (!to?.length) {
        AppLogger.warn('[MailerService] No recipient address, email skipped.');
        return false;
    }

    try {
        await getTransporter().sendMail({
            from: MailConfig.getMailSender(),
            to,
            subject,
            text,
            html,
        });

        AppLogger.info(`[MailerService] Email sent to ${to}: ${subject}`);
        return true;
    } catch (error) {
        AppLogger.error(`[MailerService] Unable to send the email to ${to}: `, error);
        return false;
    }
};

const MailerService = {
    sendMail,
};

export default MailerService;
