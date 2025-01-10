import { describe, expect, it } from 'vitest';

import LighthouseConfig from './LighthouseConfig.ts';

// Adjust the path accordingly

describe('LighthouseConfig', () => {
    it('should have valid PUPPETEER_SETTINGS', () => {
        expect(LighthouseConfig.PUPPETEER_SETTINGS).toBeDefined();
        expect(LighthouseConfig.PUPPETEER_SETTINGS.headless).toBe(true);
        expect(LighthouseConfig.PUPPETEER_SETTINGS.args).toContain('--disable-gpu');
    });

    it('should have valid PUPPETEER_PAGE_SETTINGS', () => {
        expect(LighthouseConfig.PUPPETEER_PAGE_SETTINGS).toBeDefined();
        expect(LighthouseConfig.PUPPETEER_PAGE_SETTINGS.waitUntil).toBe('load');
        expect(LighthouseConfig.PUPPETEER_PAGE_SETTINGS.timeout).toBeGreaterThan(100000000);
    });

    it('should have valid LIGHTHOUSE_FLAGS', () => {
        expect(LighthouseConfig.LIGHTHOUSE_FLAGS).toBeDefined();
        expect(LighthouseConfig.LIGHTHOUSE_FLAGS.logLevel).toBe('info');
        expect(LighthouseConfig.LIGHTHOUSE_FLAGS.onlyCategories).toEqual([
            'performance',
            'accessibility',
            'seo',
        ]);
    });

    it('should have valid LIGHTHOUSE_DEVICE_CONFIG for desktop', () => {
        const desktopConfig = LighthouseConfig.LIGHTHOUSE_DEVICE_CONFIG.desktop;
        expect(desktopConfig).toBeDefined();
        expect(desktopConfig.settings.formFactor).toBe('desktop');
        expect(desktopConfig.settings.screenEmulation.width).toBe(1350);
    });

    it('should have valid LIGHTHOUSE_DEVICE_CONFIG for mobile slow 4G', () => {
        const mobileSlow4GConfig = LighthouseConfig.LIGHTHOUSE_DEVICE_CONFIG['mobile-slow-4G'];
        expect(mobileSlow4GConfig).toBeDefined();
        expect(mobileSlow4GConfig.settings.formFactor).toBe('mobile');
        expect(mobileSlow4GConfig.settings.throttling.rttMs).toBe(150);
    });

    it('should have valid LIGHTHOUSE_DEVICE_CONFIG for mobile regular 3G', () => {
        const mobileRegular3GConfig =
            LighthouseConfig.LIGHTHOUSE_DEVICE_CONFIG['mobile-regular-3G'];
        expect(mobileRegular3GConfig).toBeDefined();
        expect(mobileRegular3GConfig.settings.formFactor).toBe('mobile');
        expect(mobileRegular3GConfig.settings.throttling.rttMs).toBe(300);
    });
});
