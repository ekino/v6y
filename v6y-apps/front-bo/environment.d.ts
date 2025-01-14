import 'next';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NEXT_PUBLIC_V6Y_BFF_PATH: string;
            NEXTAUTH_URL: string;
        }
    }
}
