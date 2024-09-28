import { Flags } from 'lighthouse/types/externs.js';
import { WaitForOptions } from 'puppeteer-core';
import { LighthouseDeviceConfigType } from '../types/LighthouseAuditType.js';
declare const LighthouseConfig: {
    PUPPETEER_SETTINGS: {
        devtools: boolean;
        headless: boolean;
        ignoreHTTPSErrors: boolean;
        args: string[];
    };
    PUPPETEER_PAGE_SETTINGS: WaitForOptions;
    LIGHTHOUSE_FLAGS: Flags;
    LIGHTHOUSE_DEVICE_CONFIG: Record<string, LighthouseDeviceConfigType>;
};
export default LighthouseConfig;
