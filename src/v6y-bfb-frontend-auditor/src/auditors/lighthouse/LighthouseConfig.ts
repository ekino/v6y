// More Options : https://github.com/GoogleChrome/chrome-launcher
import { Flags } from 'lighthouse/types/externs.js';
import { WaitForOptions } from 'puppeteer-core';

import { LighthouseDeviceConfigType } from '../types/LighthouseAuditType.js';

const PUPPETEER_SETTINGS = {
    // path must point to .exe : https://stackoverflow.com/questions/59786319/configure-puppeteer-executablepath-chrome-in-your-local-windows
    devtools: false,
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
        // https://github.com/GoogleChrome/chrome-launcher/blob/main/src/flags.ts
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-translate',
        '--force-device-scale-factor',
        '--ignore-certificate-errors',
        '--no-sandbox',
    ],
};

const PUPPETEER_PAGE_SETTINGS: WaitForOptions = {
    waitUntil: 'load',
    timeout: 1000000000,
};

const LIGHTHOUSE_FLAGS: Flags = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility'],
};

const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;
const MOTOG4_USERAGENT =
    'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';
const DESKTOP_USERAGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

const LIGHTHOUSE_DESKTOP_CONFIG: LighthouseDeviceConfigType = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'desktop',
        throttling: {
            rttMs: 40,
            throughputKbps: 10 * 1024,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0, // 0 means unset
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0,
        },
        screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
        },
        emulatedUserAgent: DESKTOP_USERAGENT,
    },
};

const LIGHTHOUSE_MOBILE_SLOW_4G_CONFIG: LighthouseDeviceConfigType = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'mobile',
        throttling: {
            rttMs: 150,
            throughputKbps: 1.6 * 1024,
            requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
            downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
            mobile: true,
            width: 412,
            height: 823,
            // This value has some interesting ramifications for image-size-responsive, see:
            // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
            deviceScaleFactor: 1.75,
            disabled: false,
        },
        emulatedUserAgent: MOTOG4_USERAGENT,
    },
};

const LIGHTHOUSE_MOBILE_REGULAR_3G_CONFIG: LighthouseDeviceConfigType = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'mobile',
        throttling: {
            rttMs: 300,
            throughputKbps: 700,
            requestLatencyMs: 300 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
            downloadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            uploadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
            mobile: true,
            width: 412,
            height: 823,
            // This value has some interesting ramifications for image-size-responsive, see:
            // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
            deviceScaleFactor: 1.75,
            disabled: false,
        },
        emulatedUserAgent: MOTOG4_USERAGENT,
    },
};

// https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
const LIGHTHOUSE_DEVICE_CONFIG: Record<string, LighthouseDeviceConfigType> = {
    desktop: LIGHTHOUSE_DESKTOP_CONFIG,
    'mobile-slow-4G': LIGHTHOUSE_MOBILE_SLOW_4G_CONFIG,
    'mobile-regular-3G': LIGHTHOUSE_MOBILE_REGULAR_3G_CONFIG,
};

const LighthouseConfig = {
    PUPPETEER_SETTINGS,
    PUPPETEER_PAGE_SETTINGS,
    LIGHTHOUSE_FLAGS,
    LIGHTHOUSE_DEVICE_CONFIG,
};

export default LighthouseConfig;
