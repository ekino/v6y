import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppInfos from '../../commons/components/application-info/VitalityAppInfos';
import { VitalityAppInfosProps } from '../../commons/types/VitalityAppInfosProps';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual('@v6y/ui-kit-front');
    return {
        ...actual,
        useNavigationAdapter: vi.fn(() => ({
            createUrlQueryParam: vi.fn((name: string, value: string) => `${name}=${value}`),
            removeUrlQueryParam: vi.fn(),
            router: {
                push: vi.fn(),
                replace: vi.fn(),
                back: vi.fn(),
                forward: vi.fn(),
                refresh: vi.fn(),
            },
        })),
        useTranslationProvider: vi.fn(() => ({ translate: (k: string) => k })),
    };
});

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

describe('VitalityAppInfos', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const createMockApp = (overrides?: Partial<VitalityAppInfosProps['app']>) => ({
        _id: 1,
        name: 'Test App',
        description: 'This is a test application.',
        contactMail: 'test@example.com',
        repo: {
            organization: 'TestOrg',
            webUrl: 'https://github.com/TestOrg/TestApp',
            gitUrl: 'https://git.github.com/TestOrg/TestApp',
            allBranches: ['main', 'dev'],
        },
        links: [{ label: 'GitHub', value: 'https://github.com/TestOrg/TestApp' }],
        ...overrides,
    });

    it('renders app details with name, branches, repo links, and contact email', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        const app = createMockApp();
        render(<VitalityAppInfos app={app} canOpenDetails={true} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('Test App');
        expect(screen.getByText('Branches (2)')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();

        const links = screen.getAllByRole('link') as HTMLAnchorElement[];
        expect(
            links.some((a) => a.getAttribute('href') === 'https://github.com/TestOrg/TestApp'),
        ).toBe(true);
    });

    it('handles incomplete app data gracefully', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        render(<VitalityAppInfos app={{ _id: 1, name: 'No Info App' }} canOpenDetails={true} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('No Info App');
        expect(screen.getByText('Branches (0)')).toBeInTheDocument();
    });

    it('toggles see reporting button based on canOpenDetails prop', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        const app = createMockApp();
        const { rerender } = render(<VitalityAppInfos app={app} canOpenDetails={true} />);
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();

        rerender(<VitalityAppInfos app={app} canOpenDetails={false} />);
        expect(screen.queryByText('vitality.appListPage.seeReporting')).not.toBeInTheDocument();
    });

    it('displays branch count correctly and shows different gradient per app ID', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        const app5Branches = createMockApp({
            repo: { allBranches: ['main', 'dev', 'feature-1', 'hotfix-1', 'feature-2'] },
        });
        const { container } = render(<VitalityAppInfos app={app5Branches} />);

        expect(screen.getByText('Branches (5)')).toBeInTheDocument();
        expect(
            container.querySelector('[class*="h-48"][class*="bg-gradient-to-br"]'),
        ).toBeInTheDocument();
    });

    it('displays metric badges based on audit report types', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: {
                getApplicationDetailsAuditReportsByParams: [
                    { _id: 1, type: 'Code-Security', category: 'commons-security' },
                    { _id: 2, type: 'Code-Security', category: 'react-security' },
                    { _id: 3, type: 'Code-Complexity' },
                    { _id: 4, category: 'accessibility' },
                ],
            },
        });

        const app = createMockApp();
        render(<VitalityAppInfos app={app} />);

        expect(screen.getByText('security')).toBeInTheDocument();
        expect(screen.getByText('maintainability')).toBeInTheDocument();
        expect(screen.getByText('accessibility')).toBeInTheDocument();
    });

    it('hides metric badges when count is zero', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        render(<VitalityAppInfos app={createMockApp()} />);

        expect(screen.queryByText('security')).not.toBeInTheDocument();
        expect(screen.queryByText('maintainability')).not.toBeInTheDocument();
        expect(screen.queryByText('accessibility')).not.toBeInTheDocument();
    });

    it('applies warning variant to branches badge when >= 4 branches', () => {
        (useClientQuery as Mock).mockReturnValue({
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        const appMany = createMockApp({
            repo: { allBranches: ['main', 'dev', 'staging', 'hotfix', 'feature'] },
        });

        render(<VitalityAppInfos app={appMany} />);
        expect(screen.getByText('Branches (5)')).toBeInTheDocument();
    });
});
