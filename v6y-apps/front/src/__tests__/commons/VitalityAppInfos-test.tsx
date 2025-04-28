import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppInfos from '../../commons/components/application-info/VitalityAppInfos';
import { VitalityAppInfosProps } from '../../commons/types/VitalityAppInfosProps';

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

        expect(screen.getByText('Test App')).toBeInTheDocument();
        expect(screen.getByText('This is a test application.')).toBeInTheDocument();
        expect(screen.getByText('TestOrg')).toBeInTheDocument();
        expect(screen.getByTestId('tag')).toHaveTextContent('vitality.appListPage.nbBranches2');
    });

    it('handles missing optional fields gracefully', () => {
        const incompleteApp = { _id: 2, name: 'No Info App' };

        render(<VitalityAppInfos app={incompleteApp} canOpenDetails={true} />);

        expect(screen.getByText('No Info App')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-tag')).not.toBeInTheDocument();
        expect(screen.queryByText('TestOrg')).not.toBeInTheDocument();
    });

    it('shows the app details link when canOpenDetails is true', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={true} />);

        expect(screen.getByText('vitality.appListPage.openDetails')).toBeInTheDocument();
    });

    it('hides the app details link when canOpenDetails is false', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={false} />);

        expect(screen.queryByText('vitality.appListPage.openDetails')).not.toBeInTheDocument();
    });

    it('renders repository and external links correctly', () => {
        render(<VitalityAppInfos app={mockApp} canOpenDetails={true} />);

        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('GitHub').closest('a')).toHaveAttribute(
            'href',
            'https://github.com/TestOrg/TestApp',
        );
        expect(screen.getByText('TestOrg')).toBeInTheDocument();
        expect(screen.getByText('TestOrg').closest('a')).toHaveAttribute(
            'href',
            'https://github.com/TestOrg/TestApp',
        );
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

        expect(screen.getByText('Vitality App')).toBeInTheDocument();
        expect(screen.getByText('An example application')).toBeInTheDocument();
        expect(screen.getByText('Vitality Org')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
            'href',
            'https://docs.example.com',
        );
    });

    it('displays contact email when available', () => {
        const app = { _id: 1, name: 'Contact App', contactMail: 'contact@example.com' };

        render(<VitalityAppInfos app={app} />);

        const emailLink = screen.getByRole('link', { name: 'vitality.appListPage.contactEmail' }); // Assuming this is the label
        expect(emailLink).toHaveAttribute('href', 'mailto:contact@example.com');
    });

    it('does not display contact email if missing', () => {
        const app = { _id: 1, name: 'No Contact App' };

        render(<VitalityAppInfos app={app} />);

        expect(screen.queryByText('vitality.appListPage.contactEmail')).not.toBeInTheDocument();
    });

    it('displays open details link when canOpenDetails is true', () => {
        const app = { _id: 1, name: 'Details App' };

        render(<VitalityAppInfos app={app} canOpenDetails={true} />);

        const detailsLink = screen.getByRole('link', { name: 'vitality.appListPage.openDetails' });
        expect(detailsLink).toBeInTheDocument();
    });

    it('does not display open details link when canOpenDetails is false', () => {
        const app = { _id: 1, name: 'No Details App' };

        render(<VitalityAppInfos app={app} canOpenDetails={false} />);

        expect(screen.queryByText('vitality.appListPage.openDetails')).not.toBeInTheDocument();
    });

    it('renders multiple links correctly', () => {
        const app = {
            _id: 1,
            name: 'Link App',
            links: [
                { label: 'GitHub', value: 'https://github.com' },
                { label: 'Documentation', value: 'https://docs.example.com' },
            ],
        };

        render(<VitalityAppInfos app={app} />);

        expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
            'href',
            'https://github.com',
        );
        expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
            'href',
            'https://docs.example.com',
        );
    });

    it('renders without crashing when given an empty object', () => {
        render(<VitalityAppInfos app={{ _id: 999 }} canOpenDetails={true} />);

        expect(screen.getByText('vitality.appListPage.nbBranches0')).toBeInTheDocument(); // Should not throw an error
    });

    it('handles repositories without organization correctly', () => {
        const app = {
            _id: 2,
            name: 'Repo App',
            repo: {
                webUrl: 'https://example.com/repo',
            },
        };

        render(<VitalityAppInfos app={app} />);

        const repoLink = screen.getByRole('link', { name: '' });
        expect(repoLink).toHaveAttribute('href', 'https://example.com/repo');
    });

    it('applies correct tag color based on branch count', () => {
        const app = {
            _id: 4,
            name: 'Branch Test App',
            repo: { allBranches: ['main', 'develop', 'feature-1', 'hotfix-1', 'feature-2'] }, // 5 branches (should be error)
        };

        render(<VitalityAppInfos app={app} />);

        const branchTag = screen.getByTestId('tag'); // Ensure this matches the actual test ID used
        expect(branchTag).toHaveAttribute('style', 'color: red;'); // Assuming error status is red
    });

    it('renders long descriptions correctly without breaking layout', () => {
        const longDescription = 'Lorem ipsum '.repeat(100); // Long text

        const app = {
            _id: 5,
            name: 'Long Desc App',
            description: longDescription,
        };

        render(<VitalityAppInfos app={app} />);

        expect(screen.getByText((content) => content.includes('Lorem ipsum'))).toBeInTheDocument();
    });

    it('ensures contact email uses mailto format', () => {
        const app = { _id: 7, name: 'Email App', contactMail: 'support@example.com' };

        render(<VitalityAppInfos app={app} />);

        const emailLink = screen.getByRole('link', { name: 'vitality.appListPage.contactEmail' });
        expect(emailLink).toHaveAttribute('href', 'mailto:support@example.com');
    });
});
