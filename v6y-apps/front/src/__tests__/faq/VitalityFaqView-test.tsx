import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityFaqView from '../../features/faq/components/VitalityFaqView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

describe('VitalityFaqView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows contact link when loading', () => {
        (useClientQuery as Mock).mockReturnValue({ isLoading: true, data: undefined });

        render(<VitalityFaqView />);

        // Contact link should still be rendered
        expect(screen.getByRole('link', { name: 'vitality.appListPage.contactEmail' })).toBeInTheDocument();
    });

    it('renders contact link when there are no FAQs', async () => {
        (useClientQuery as Mock).mockReturnValue({ isLoading: false, data: { getFaqListByPageAndParams: [] } });

        render(<VitalityFaqView />);

        await waitFor(() => {
            expect(screen.getByRole('link', { name: 'vitality.appListPage.contactEmail' })).toBeInTheDocument();
            // No accordion items should be present
            const accordionTitles = screen.queryAllByRole('button');
            expect(accordionTitles.length).toBe(0);
        });
    });

    it('renders FAQ list when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getFaqListByPageAndParams: [
                    { title: 'How to use Vitality?', description: 'Step-by-step guide', links: [] },
                    { title: 'How to reset my password?', description: 'Go to settings', links: [] },
                ],
            },
        });

        render(<VitalityFaqView />);

        await waitFor(() => {
            // Titles should be present as accordion triggers
            expect(screen.getByText('How to use Vitality?')).toBeInTheDocument();
            expect(screen.getByText('How to reset my password?')).toBeInTheDocument();

            // The first item's description should be visible (default open)
            expect(screen.getByText('Step-by-step guide')).toBeInTheDocument();
            
            // The second item's description may not be visible since accordion is collapsed
            // We only test that the title is present, not the description
        });
    });
});
