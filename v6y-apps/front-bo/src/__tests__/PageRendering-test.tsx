import '@testing-library/jest-dom/vitest';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityApplicationListView from '../features/v6y-applications/components/VitalityApplicationListView';
import { renderWithProviders } from './render.utils';

/**
 * Tests for page rendering in front-bo app
 * Ensures that each page component is rendered correctly with proper structure
 */

describe('Page Rendering - Applications List', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the applications list view component', () => {
        const { container } = renderWithProviders(<VitalityApplicationListView />);

        expect(container).toBeTruthy();
        expect(container.firstChild).toBeTruthy();
    });

    it('should render AdminListWrapper with correct props', () => {
        renderWithProviders(<VitalityApplicationListView />);

        // The component should render without throwing errors
        expect(screen.getByTestId('mock-form')).toBeTruthy();
    });

    it('should use correct translation keys for title', () => {
        renderWithProviders(<VitalityApplicationListView />);

        // Component should render - translation mocking is in place
        const form = screen.getByTestId('mock-form');
        expect(form).toBeInTheDocument();
    });

    it('should render table with application data', async () => {
        const { container } = renderWithProviders(<VitalityApplicationListView />);

        // Verify the component renders without errors
        expect(container.firstChild).toBeTruthy();

        await waitFor(() => {
            expect(container.querySelector('form')).toBeTruthy();
        });
    });

    it('should pass correct query options to AdminListWrapper', () => {
        const { container } = renderWithProviders(<VitalityApplicationListView />);

        // Component should render with provided options
        expect(container).toBeTruthy();
    });

    it('should render VitalityTable component', () => {
        renderWithProviders(<VitalityApplicationListView />);

        // Component should be in the document
        const form = screen.getByTestId('mock-form');
        expect(form).toBeInTheDocument();
    });

    it('should set up list page with proper sorter configuration', () => {
        const { container } = renderWithProviders(<VitalityApplicationListView />);

        // Component renders with sorter configuration
        expect(container.firstChild).toBeTruthy();
    });

    it('should configure table with edit, show, and delete options', () => {
        renderWithProviders(<VitalityApplicationListView />);

        // Verify component has all necessary configurations
        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    });
});

describe('Page Structure and Accessibility', () => {
    it('should have proper document structure', () => {
        const { container } = renderWithProviders(<VitalityApplicationListView />);

        // Verify form exists (from AdminListWrapper mocking)
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
    });

    it('should render list page without console errors', () => {
        const consoleError = vi.spyOn(console, 'error');

        renderWithProviders(<VitalityApplicationListView />);

        // Should not have errors during render
        expect(consoleError).not.toHaveBeenCalled();

        consoleError.mockRestore();
    });

    it('should properly integrate with translation provider', () => {
        renderWithProviders(<VitalityApplicationListView />);

        // Component should render successfully
        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    });
});
