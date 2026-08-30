export interface AccountType {
    _id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    applications?: number[];
    slackUserId?: string | null;
}

export interface AccountInputType {
    _id?: number;
    username: string;
    email: string;
    password?: string;
    role: string;
    applications?: number[];
    slackUserId?: string | null;
}

export interface AccountUpdatePasswordType {
    _id: number;
    password: string;
}

export interface AccountLoginType {
    email: string;
    password: string;
}
