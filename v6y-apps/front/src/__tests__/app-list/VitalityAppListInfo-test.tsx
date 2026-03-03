import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppListInfo from '../../features/app-list/components/VitalityAppListInfo';

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual('@v6y/ui-kit-front');
    return {
        ...actual,
        useTranslationProvider: vi.fn(() => ({
            translate: (key: string) => {
                const translations: { [key: string]: string } = {
                    'vitality.appListPage.infoTitle': 'Application Auditing Dashboard',
                    'vitality.appListPage.infoDescription':
                        'This dashboard aggregates audit reports from various auditors to provide a comprehensive view of your applications.',
                    'vitality.appListPage.infoFeature1Title': 'Security Analysis',
                    'vitality.appListPage.infoFeature1Desc':
                        'Security vulnerabilities and code quality',
                    'vitality.appListPage.infoFeature2Title': 'Maintainability Metrics',
                    'vitality.appListPage.infoFeature2Desc':
                        'Code complexity and coupling analysis',
                    'vitality.appListPage.infoFeature3Title': 'Accessibility Audit',
                    'vitality.appListPage.infoFeature3Desc':
                        'WCAG compliance and accessibility standards',
                };
                return translations[key] || key;
            },
        })),
    };
});

describe('VitalityAppListInfo', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders info card with title, description, and three features', () => {
        render(<VitalityAppListInfo />);

        expect(screen.getByText('Application Auditing Dashboard')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This dashboard aggregates audit reports from various auditors to provide a comprehensive view of your applications.',
            ),
        ).toBeInTheDocument();

        // Check for feature titles
        expect(screen.getByText('Security Analysis')).toBeInTheDocument();
        expect(screen.getByText('Maintainability Metrics')).toBeInTheDocument();
        expect(screen.getByText('Accessibility Audit')).toBeInTheDocument();

        // Check for feature descriptions
        expect(screen.getByText('Security vulnerabilities and code quality')).toBeInTheDocument();
        expect(screen.getByText('Code complexity and coupling analysis')).toBeInTheDocument();
        expect(screen.getByText('WCAG compliance and accessibility standards')).toBeInTheDocument();
    });

    it('applies proper card styling and layout', () => {
        const { container } = render(<VitalityAppListInfo />);

        // Check for full width wrapper
        expect(container.querySelector('[class*="w-full"]')).toBeInTheDocument();
        // Check for flex layout
        expect(container.querySelector('[class*="flex"][class*="gap"]')).toBeInTheDocument();
        // Check for border separator
        expect(container.querySelector('[class*="border-t"]')).toBeInTheDocument();
        // Check for uppercase styling
        expect(container.querySelector('[class*="uppercase"]')).toBeInTheDocument();
    });
});
