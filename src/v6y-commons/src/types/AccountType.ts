export interface AccountType {
    _id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    applications?: number[];
}

export interface AccountInputType {
    _id?: number;
    username: string;
    email: string;
    password: string;
    role: string;
    applications?: number[];
}
