import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useNavigationAdapter } from '@v6y/shared-ui/src/hooks';
import { useThemeConfigProvider } from '@v6y/shared-ui/src/hooks';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppInfos from '../application-info/VitalityAppInfos';

vi.mock(import('@v6y/shared-ui/src/hooks'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigationAdapter: vi.fn(),
        useThemeConfigProvider: vi.fn(),
    };
});

describe('VitalityAppInfos', () => {
    const mockApp = {
        _id: 1,
        name: 'Test App',
        description: 'Test description',
        contactMail: 'test@example.com',
        repo: {
            organization: 'test-org',
            webUrl: 'https://github.com/test-org/test-repo',
            allBranches: ['main', 'develop'],
        },
        links: [
            {
                label: 'Production',
                value: 'https://test-app.com',
            },
        ],
    };

    beforeEach(() => {
        (useNavigationAdapter as Mock).mockReturnValue({
            createUrlQueryParam: vi.fn((key, value) => `${key}=${value}`),
        });
        (useThemeConfigProvider as Mock).mockReturnValue({
            currentConfig: {},
        });
    });

    it('should render the component with app details', () => {
        render(<VitalityAppInfos app={mockApp} />);

        expect(screen.getByText('Test App')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('Number of opened branches: 2')).toBeInTheDocument();
        expect(screen.getByText('Contact The Team')).toBeInTheDocument(); // Assuming VitalityTerms.VITALITY_APP_LIST_CONTACT_EMAIL is "Contact email"
        expect(screen.getByText('test-org')).toBeInTheDocument();
        expect(screen.getByText('Production')).toBeInTheDocument();
        expect(screen.getByText('See Details')).toBeInTheDocument(); // Assuming VitalityTerms.VITALITY_APP_LIST_OPEN_DETAILS_LABEL is "Open details"
    });

    it('should not render the details link if canOpenDetails is false', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={false} />);
        expect(screen.queryByText('Open details')).not.toBeInTheDocument();
    });

    it('should render without contact email', () => {
        const appWithoutEmail = { ...mockApp, contactMail: '' };
        render(<VitalityAppInfos app={appWithoutEmail} />);
        expect(screen.queryByText('Contact The Team')).not.toBeInTheDocument();
    });

    it('should render with more than 10 branches', () => {
        const appWithManyBranches = {
            ...mockApp,
            repo: { ...mockApp.repo, allBranches: new Array(11).fill('branch') },
        };
        render(<VitalityAppInfos app={appWithManyBranches} />);
        expect(screen.getByText('Number of opened branches: 11')).toBeInTheDocument();
    });

    it('should render with no branches', () => {
        const appWithNoBranches = { ...mockApp, repo: { ...mockApp.repo, allBranches: [] } };
        render(<VitalityAppInfos app={appWithNoBranches} />);
        expect(screen.getByText('Number of opened branches: 0')).toBeInTheDocument();
    });

    it('should render with no links', () => {
        const appWithNoLinks = { ...mockApp, links: [] };
        render(<VitalityAppInfos app={appWithNoLinks} />);
        expect(screen.queryByText('Production')).not.toBeInTheDocument();
    });

    it('should render with no repository', () => {
        const appWithNoRepo = { ...mockApp, repo: null };
        render(<VitalityAppInfos app={appWithNoRepo} />);
        expect(screen.queryByText('test-org')).not.toBeInTheDocument();
    });

    it('should render with no description', () => {
        const appWithNoDescription = { ...mockApp, description: '' };
        render(<VitalityAppInfos app={appWithNoDescription} />);
        expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });
});
