import 'next';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NEXT_PUBLIC_V6Y_BFB_URL_DYNAMIC_AUDITOR_API_PATH: string;
            NEXT_PUBLIC_V6Y_BFB_URL_DYNAMIC_AUDITOR_HEALTH_CHECK_PATH: string;
            NEXT_PUBLIC_V6Y_BFB_URL_DYNAMIC_AUDITOR_MONITORING_PATH: string;
            NEXT_PUBLIC_V6Y_BFB_URL_DYNAMIC_AUDITOR_PATH: string;
        }
    }
}
