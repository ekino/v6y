import "next";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NEXT_PUBLIC_V6Y_GQL_API_BASE_PATH: string;
            NEXT_PUBLIC_NEXTAUTH_URL: string;
        }
    }
}