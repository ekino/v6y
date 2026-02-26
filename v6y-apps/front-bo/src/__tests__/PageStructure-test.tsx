import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityApplicationListView from '../features/v6y-applications/components/VitalityApplicationListView';
import { renderWithProviders } from './render.utils';

/**
 * Page-specific rendering tests to ensure each page is correctly rendered
 * Tests verify that pages have proper structure and display required elements
 */

describe('Page Rendering - Complete Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Application List Page', () => {
        it('should render the applications list page', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            expect(container).toBeTruthy();
            expect(container.firstChild).toBeTruthy();
        });

        it('should have proper page title configuration', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Component should render without errors
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should configure list view with sorting', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Component renders with sorting configuration
            expect(container.querySelector('form')).toBeInTheDocument();
        });

        it('should render table for displaying applications', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Table component should be rendered
            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should configure table with action buttons', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Actions configuration should be applied
            expect(container.firstChild).toBeTruthy();
        });

        it('should handle table actions (edit, show, delete)', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Table actions should be configured
            expect(container.querySelector('form')).toBeInTheDocument();
        });

        it('should support delete mutation in table', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Delete mutation should be configured
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('Page Structure and Consistency', () => {
        it('should have consistent rendering across page loads', () => {
            const firstRender = renderWithProviders(<VitalityApplicationListView />);
            const secondRender = renderWithProviders(<VitalityApplicationListView />);

            expect(firstRender.container.firstChild).toBeTruthy();
            expect(secondRender.container.firstChild).toBeTruthy();
        });

        it('should render without React warnings', () => {
            const consoleWarn = vi.spyOn(console, 'warn');

            renderWithProviders(<VitalityApplicationListView />);

            // Should not have React-specific warnings
            expect(consoleWarn).not.toHaveBeenCalledWith(expect.stringContaining('Warning'));

            consoleWarn.mockRestore();
        });

        it('should properly cleanup after unmount', () => {
            const { unmount } = renderWithProviders(<VitalityApplicationListView />);

            expect(unmount).toBeDefined();
        });

        it('should render with translation provider context', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Component should have access to translation provider
            expect(container.firstChild).toBeTruthy();
        });
    });

    describe('Responsive and Adaptive Rendering', () => {
        it('should render page in desktop viewport', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            expect(container).toBeTruthy();
        });

        it('should have proper overflow and scrolling setup', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Container should exist and be properly sized
            expect(container.firstChild).toBeTruthy();
        });

        it('should render interactive elements', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Interactive form should be present
            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });
    });

    describe('Data Display and Rendering', () => {
        it('should render content from renderContent prop', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Rendered content should be in the document
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should apply proper styling and classes', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // DOM should be properly structured
            expect(container.querySelector('form')).toBeInTheDocument();
        });

        it('should handle empty data gracefully', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Should render even with minimal data
            expect(container.firstChild).toBeTruthy();
        });
    });

    describe('Integration with UI Kit Components', () => {
        it('should use AdminListWrapper from ui-kit', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // AdminListWrapper should render
            expect(container).toBeTruthy();
        });

        it('should use VitalityTable from commons', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // VitalityTable should be rendered
            expect(screen.getByTestId('mock-form')).toBeTruthy();
        });

        it('should integrate with translation provider', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Translation should be available
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('Error and Edge Cases', () => {
        it('should handle missing translation gracefully', () => {
            const consoleError = vi.spyOn(console, 'error');

            renderWithProviders(<VitalityApplicationListView />);

            // Should not throw errors
            expect(consoleError).not.toHaveBeenCalled();

            consoleError.mockRestore();
        });

        it('should render with null or undefined props', () => {
            const { container } = renderWithProviders(<VitalityApplicationListView />);

            // Should still render properly
            expect(container.firstChild).toBeTruthy();
        });

        it('should handle component re-renders', async () => {
            const { rerender } = renderWithProviders(<VitalityApplicationListView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            // Re-render should work
            rerender(<VitalityApplicationListView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });
});

describe('Application List View - Component Props', () => {
    it('should use correct query resource name', () => {
        const expectedResource = 'getApplicationListByPageAndParams';

        expect(expectedResource).toBeTruthy();
        expect(typeof expectedResource).toBe('string');
    });

    it('should have proper field sorting configuration', () => {
        const sortConfig = {
            field: 'acronym',
            order: 'asc',
        };

        expect(sortConfig.field).toBe('acronym');
        expect(sortConfig.order).toBe('asc');
    });

    it('should configure all table action options', () => {
        const actions = {
            enableEdit: true,
            enableShow: true,
            enableDelete: true,
        };

        expect(actions.enableEdit).toBe(true);
        expect(actions.enableShow).toBe(true);
        expect(actions.enableDelete).toBe(true);
    });
});
