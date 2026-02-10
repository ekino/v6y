import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityNotificationView from '../../features/notifications/components/VitalityNotificationView';
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
            {isEmpty ? (
                <div data-testid="mock-empty-view">No Notification Available</div>
            ) : (
                children
            )}
        </div>
    ),
}));

describe('VitalityNotificationView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when fetching Notification', () => {
        (useClientQuery as Mock).mockReturnValue({ isLoading: true, data: undefined });

        render(<VitalityNotificationView />);
        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty view when there are no Notification', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getNotificationListByPageAndParams: [] },
        });

        render(<VitalityNotificationView />);
        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });

    it('renders Notification list when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getNotificationListByPageAndParams: [
                    { title: 'How to use Vitality?', description: 'Step-by-step guide', links: [] },
                    {
                        title: 'How to reset my password?',
                        description: 'Go to settings',
                        links: [],
                    },
                ],
            },
        });

        render(<VitalityNotificationView />);

        await waitFor(() => {
            expect(screen.getByText('vitality.notificationsPage.pageTitle')).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('How to use Vitality?')),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('How to reset my password?')),
            ).toBeInTheDocument();
        });

        // Expand the first collapse to check the description
        const firstCollapseHeader = screen.getByText('How to use Vitality?');
        fireEvent.click(firstCollapseHeader);

        await waitFor(() => {
            expect(
                screen.getByText((content) => content.includes('Step-by-step guide')),
            ).toBeInTheDocument();
        });

        // Expand the second collapse to check the description
        const secondCollapseHeader = screen.getByText('How to reset my password?');
        fireEvent.click(secondCollapseHeader);

        await waitFor(() => {
            expect(
                screen.getByText((content) => content.includes('Go to settings')),
            ).toBeInTheDocument();
        });
    });
});
