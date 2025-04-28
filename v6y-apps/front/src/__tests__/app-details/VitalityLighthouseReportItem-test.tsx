import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityLighthouseReportItem from '../../features/app-details/components/audit-reports/auditors/lighthouse/VitalityLighthouseReportItem';

describe('VitalityLighthouseReportItem', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders audit report details correctly', () => {
        const report = {
            _id: 1,
            type: 'Lighthouse',
            category: 'Performance',
            subCategory: 'Page Speed',
            status: 'Completed',
            score: 92,
            scoreUnit: '%',
            module: { url: 'https://example.com', appId: 2 },
        };

        render(<VitalityLighthouseReportItem report={report} onOpenHelpClicked={vi.fn()} />);

        expect(screen.getByText('Lighthouse')).toBeInTheDocument();
        expect(
            screen.getByText('vitality.appDetailsPage.audit.helpCategory: Performance'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('mock-statistic')).toHaveTextContent('92%');
        expect(
            screen.getByRole('link', { name: 'vitality.appDetailsPage.audit.openApp' }),
        ).toHaveAttribute('href', 'https://example.com');
    });

    it('triggers onOpenHelpClicked when info button is clicked', () => {
        const mockOnOpenHelpClicked = vi.fn();

        const report = {
            _id: 1,
            type: 'Lighthouse',
            category: 'Performance',
            subCategory: 'Page Speed',
            status: 'Completed',
            score: 92,
            scoreUnit: '%',
            module: { url: 'https://example.com', appId: 2 },
        };

        render(
            <VitalityLighthouseReportItem
                report={report}
                onOpenHelpClicked={mockOnOpenHelpClicked}
            />,
        );

        const helpButton = screen.getByTestId('help-button');
        fireEvent.click(helpButton);

        expect(mockOnOpenHelpClicked).toHaveBeenCalledWith(report);
    });

    it('handles missing optional fields gracefully', () => {
        const report = {
            _id: 1,
            type: 'Lighthouse',
            category: 'Accessibility',
            subCategory: 'Contrast Ratio',
            status: 'Completed',
        };

        render(<VitalityLighthouseReportItem report={report} onOpenHelpClicked={vi.fn()} />);

        expect(screen.getByText('Lighthouse')).toBeInTheDocument();
        expect(
            screen.getByText('vitality.appDetailsPage.audit.helpCategory: Accessibility'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('mock-statistic')).toHaveTextContent('0');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('handles reports with missing type gracefully', () => {
        const report = {
            _id: 1,
            category: 'Accessibility',
            subCategory: 'Contrast Ratio',
            status: 'Completed',
            score: 85,
            scoreUnit: '%',
        };

        render(<VitalityLighthouseReportItem report={report} onOpenHelpClicked={vi.fn()} />);

        expect(
            screen.getByText('vitality.appDetailsPage.audit.helpCategory: Accessibility'),
        ).toBeInTheDocument(); // Assuming default text
    });

    it('handles extreme score values correctly', () => {
        const reports = [
            { _id: 1, type: 'Lighthouse', category: 'Performance', score: -5, scoreUnit: '%' },
            { _id: 2, type: 'Lighthouse', category: 'Accessibility', score: 9999, scoreUnit: '%' },
        ];

        render(
            <>
                {reports.map((report, index) => (
                    <VitalityLighthouseReportItem
                        key={index}
                        report={report}
                        onOpenHelpClicked={vi.fn()}
                    />
                ))}
            </>,
        );

        const statisticValues = screen.getAllByTestId('mock-statistic-value');

        expect(statisticValues[0]).toHaveTextContent('-5');
        expect(statisticValues[1]).toHaveTextContent('9999');
    });

    it('opens help modal when the info button is clicked', () => {
        const mockOnOpenHelpClicked = vi.fn();
        const report = {
            _id: 1,
            type: 'Lighthouse',
            category: 'Performance',
            status: 'Completed',
            auditHelp: {
                title: 'Audit Help Title',
                description: 'Some detailed explanation.',
            },
        };

        render(
            <VitalityLighthouseReportItem
                report={report}
                onOpenHelpClicked={mockOnOpenHelpClicked}
            />,
        );

        const helpButton = screen.getByTestId('help-button');
        fireEvent.click(helpButton);

        expect(mockOnOpenHelpClicked).toHaveBeenCalledWith(report);
    });
});
