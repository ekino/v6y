export interface AccountType {
    _id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    applications?: number[];
    auditReportEmailsEnabled?: boolean;
    dailyDigestEmailsEnabled?: boolean;
}

export interface AccountInputType {
    _id?: number;
    username: string;
    email: string;
    password?: string;
    role: string;
    applications?: number[];
}

export interface AccountNotificationSettingsInputType {
    auditReportEmailsEnabled?: boolean;
    dailyDigestEmailsEnabled?: boolean;
}

export interface AccountUpdatePasswordType {
    _id: number;
    password: string;
}

export interface AccountLoginType {
    email: string;
    password: string;
}
