import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityFaqView from '../../features/faq/components/VitalityFaqView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

// Mock dependencies
vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

vi.mock('../../../commons/components/VitalitySectionView', () => ({
    __esModule: true,
    default: ({
        isLoading,
        isEmpty,
        children,
    }: {
        isLoading: boolean;
        isEmpty: boolean;
        children: React.ReactNode;
    }) => (
        <div data-testid="mock-section-view">
            {isLoading ? <div data-testid="mock-loading">Loading...</div> : null}
            {isEmpty ? <div data-testid="mock-empty-view">No FAQs Available</div> : children}
        </div>
    ),
}));

describe('VitalityFaqView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when fetching FAQs', () => {
        (useClientQuery as Mock).mockReturnValue({ isLoading: true, data: undefined });

        render(<VitalityFaqView />);
        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty view when there are no FAQs', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getFaqListByPageAndParams: [] },
        });

        render(<VitalityFaqView />);
        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });

    it('renders FAQ list when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getFaqListByPageAndParams: [
                    { title: 'How to use Vitality?', description: 'Step-by-step guide', links: [] },
                    {
                        title: 'How to reset my password?',
                        description: 'Go to settings',
                        links: [],
                    },
                ],
            },
        });

        render(<VitalityFaqView />);

        await waitFor(() => {
            expect(screen.getByText('Frequent Questions')).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('How to use Vitality?')),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('Step-by-step guide')),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('How to reset my password?')),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('Go to settings')),
            ).toBeInTheDocument();
        });
    });
});
