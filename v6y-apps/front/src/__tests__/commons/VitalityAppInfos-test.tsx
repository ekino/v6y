import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppInfos from '../../commons/components/application-info/VitalityAppInfos';
import { VitalityAppInfosProps } from '../../commons/types/VitalityAppInfosProps';

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

describe('VitalityAppInfos', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const mockApp: VitalityAppInfosProps['app'] = {
        _id: 1,
        name: 'Test App',
        description: 'This is a test application.',
        contactMail: 'test@example.com',
        repo: {
            organization: 'TestOrg',
            webUrl: 'https://github.com/TestOrg/TestApp',
            allBranches: ['main', 'dev'],
        },
        links: [{ label: 'GitHub', value: 'https://github.com/TestOrg/TestApp' }],
    };

    it('renders app details correctly', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={true} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('Test App');
        expect(screen.getByText('Branches (2)')).toBeInTheDocument();
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();

        // Links pills should render
        expect(screen.getByText('GitHub')).toBeInTheDocument();

        // Repo web url should be present among anchors
        const anchors = screen.getAllByRole('link') as HTMLAnchorElement[];
        expect(anchors.some((a) => a.getAttribute('href') === 'https://github.com/TestOrg/TestApp')).toBe(true);

        // Contact mailto link
        const mailLink = anchors.find((a) => a.getAttribute('href')?.startsWith('mailto:'));
        expect(mailLink).toBeDefined();
    });

    it('handles missing optional fields gracefully', () => {
        const incompleteApp = { _id: 2, name: 'No Info App' };

        render(<VitalityAppInfos app={incompleteApp} canOpenDetails={true} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('No Info App');
        expect(screen.getByText('Branches (0)')).toBeInTheDocument();
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();
    });

    it('shows the app details link when canOpenDetails is true', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={true} />);

        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();
    });

    it('shows the app details link when canOpenDetails is false', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={false} />);

        // When canOpenDetails is false, the See Reporting button should be hidden
        expect(screen.queryByText('vitality.appListPage.seeReporting')).toBeNull();
    });

    it('renders repository links correctly', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={true} />);

        const anchors = screen.getAllByRole('link') as HTMLAnchorElement[];
        expect(anchors.some((a) => a.getAttribute('href') === 'https://github.com/TestOrg/TestApp')).toBe(true);
    });

    it('renders application details correctly', () => {
        const app = {
            _id: 1,
            name: 'Vitality App',
            description: 'An example application',
            repo: {
                organization: 'Vitality Org',
                webUrl: 'https://repo.example.com',
                allBranches: ['main', 'develop'],
            },
            links: [{ label: 'Docs', value: 'https://docs.example.com' }],
        };

        render(<VitalityAppInfos app={app} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('Vitality App');
        expect(screen.getByText('Branches (2)')).toBeInTheDocument();
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();
    });

    it('displays open details link when canOpenDetails is true', () => {
        const app = { _id: 1, name: 'Details App' };

        render(<VitalityAppInfos app={app} canOpenDetails={true} />);

        const detailsLink = screen.getByText('vitality.appListPage.seeReporting');
        expect(detailsLink).toBeInTheDocument();
    });

    it('displays open details link when canOpenDetails is false', () => {
        const app = { _id: 1, name: 'No Details App' };

        render(<VitalityAppInfos app={app} canOpenDetails={false} />);

        // Should not render when canOpenDetails is false
        expect(screen.queryByText('vitality.appListPage.seeReporting')).toBeNull();
    });

    it('renders without crashing when given an empty object', () => {
        render(<VitalityAppInfos app={{ _id: 999 }} canOpenDetails={true} />);

        expect(screen.getByText('Branches (0)')).toBeInTheDocument();
        expect(screen.getByText('vitality.appListPage.seeReporting')).toBeInTheDocument();
    });

    it('applies correct branch count display', () => {
        const app = {
            _id: 4,
            name: 'Branch Test App',
            repo: { allBranches: ['main', 'develop', 'feature-1', 'hotfix-1', 'feature-2'] },
        };

        render(<VitalityAppInfos app={app} />);

        expect(screen.getByText('Branches (5)')).toBeInTheDocument();
    });

    it('renders app name correctly', () => {
        const app = { _id: 7, name: 'Email App', contactMail: 'support@example.com' };

        render(<VitalityAppInfos app={app} />);

        expect(screen.getByTestId('app-name')).toHaveTextContent('Email App');
    });
});
