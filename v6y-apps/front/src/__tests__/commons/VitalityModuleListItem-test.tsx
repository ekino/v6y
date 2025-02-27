import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityModuleListItem from '../../commons/components/modules/VitalityModuleListItem';
import { VitalityModuleType } from '../../commons/types/VitalityModulesProps';

describe('VitalityModuleListItem', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders module details correctly', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Security Module',
            label: '',
            type: 'Security',
            category: 'Code Quality',
            score: 85,
            scoreUnit: '%',
            status: 'Completed',
            branch: 'main',
            path: 'src/security',
            auditHelp: {},
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityModuleListItem module={moduleItem} onModuleClicked={vi.fn()} />);

        expect(screen.getByText('Security Module')).toBeInTheDocument();
        expect(screen.getByTestId('mock-statistic')).toHaveTextContent('85%');
        expect(screen.getByText('main')).toBeInTheDocument();
        expect(screen.getByText('src/security')).toBeInTheDocument();
    });

    it('handles missing optional fields gracefully', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Incomplete Module',
            label: '',
            type: 'Performance',
            category: 'Optimization',
            score: 0, // Score is missing
            scoreUnit: '',
            status: 'Warning',
            branch: '',
            path: '',
            auditHelp: {},
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityModuleListItem module={moduleItem} onModuleClicked={vi.fn()} />);

        expect(screen.getByText('Incomplete Module')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-statistic')).not.toBeInTheDocument(); // Score is missing
        expect(screen.queryByText('branch')).not.toBeInTheDocument(); // Branch is missing
        expect(screen.queryByText('path')).not.toBeInTheDocument(); // Path is missing
    });

    it('triggers onModuleClicked when info button is clicked', () => {
        const mockOnModuleClicked = vi.fn();

        const moduleItem: VitalityModuleType = {
            name: 'Security Module',
            label: '',
            type: 'Security',
            category: 'Code Quality',
            score: 85,
            scoreUnit: '%',
            status: 'Completed',
            branch: 'main',
            path: 'src/security',
            auditHelp: { key: 'value' }, // Ensures info button appears
            statusHelp: {},
            evolutionHelp: {},
        };

        render(
            <VitalityModuleListItem module={moduleItem} onModuleClicked={mockOnModuleClicked} />,
        );

        const helpButton = screen.getByRole('button');
        fireEvent.click(helpButton);

        expect(mockOnModuleClicked).toHaveBeenCalledWith(moduleItem);
    });

    it('renders different statuses with correct styling', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Status Module',
            label: '',
            type: 'Security',
            category: 'Testing',
            score: 92,
            scoreUnit: '%',
            status: 'error', // Should apply red styling
            branch: '',
            path: '',
            auditHelp: {},
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityModuleListItem module={moduleItem} onModuleClicked={vi.fn()} />);

        const statusIcon = screen.getByTestId('mock-statistic');

        expect(statusIcon).toHaveAttribute('style', 'color: red;');
    });

    it('handles extreme score values correctly', () => {
        const modules = [
            {
                path: '',
                label: '',
                branch: '',
                name: 'Low Score',
                type: 'Security',
                category: 'Code Quality',
                score: -10,
                scoreUnit: '%',
                status: 'default',
            },
            {
                path: '',
                label: '',
                branch: '',
                name: 'High Score',
                type: 'Security',
                category: 'Code Quality',
                score: 9999,
                scoreUnit: '%',
                status: 'default',
            },
        ];

        render(
            <>
                {modules.map((mod, index) => (
                    <VitalityModuleListItem
                        key={index}
                        module={{ ...mod, auditHelp: {}, statusHelp: {}, evolutionHelp: {} }}
                        onModuleClicked={vi.fn()}
                    />
                ))}
            </>,
        );

        const statistics = screen.getAllByTestId('mock-statistic-value');

        expect(statistics[0]).toHaveTextContent('-10');
        expect(statistics[1]).toHaveTextContent('9999');
    });

    it('does not display info button when there is no auditHelp, statusHelp, or evolutionHelp', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Module without Help',
            label: '',
            type: 'Security',
            category: 'Testing',
            score: 75,
            scoreUnit: '%',
            status: 'Completed',
            branch: 'dev',
            path: 'src/module',
            auditHelp: {}, // No help info
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityModuleListItem module={moduleItem} onModuleClicked={vi.fn()} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No info button should be visible
    });

    it('renders multiple modules in a list correctly', () => {
        const modules = [
            {
                type: '',
                path: '',
                label: '',
                branch: '',
                name: 'Module A',
                category: 'Security',
                score: 85,
                scoreUnit: '%',
                status: 'success',
            },
            {
                type: '',
                path: '',
                label: '',
                branch: '',
                name: 'Module B',
                category: 'Performance',
                score: 92,
                scoreUnit: '%',
                status: 'warning',
            },
        ];

        render(
            <div data-testid="module-list">
                {modules.map((mod, index) => (
                    <VitalityModuleListItem
                        key={index}
                        module={{ ...mod, auditHelp: {}, statusHelp: {}, evolutionHelp: {} }}
                        onModuleClicked={vi.fn()}
                    />
                ))}
            </div>,
        );

        const items = screen.getAllByTestId('mock-statistic');
        expect(items.length).toBe(modules.length);
    });
});
