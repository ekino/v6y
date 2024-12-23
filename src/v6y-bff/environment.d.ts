import 'next';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NEXT_PUBLIC_V6Y_GQL_API_PATH: string;
            NEXT_PUBLIC_V6Y_GQL_HEALTH_CHECK_PATH: string;
            NEXT_PUBLIC_V6Y_GQL_MONITORING_PATH: string;
        }
    }
}
