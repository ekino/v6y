import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAiSummaryCard from '../../features/app-details/components/ai-summary/VitalityAiSummaryCard';
import {
    buildClientQuery,
    useClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

vi.mock('../../commons/config/VitalityApiConfig', () => ({
    default: { VITALITY_BFF_URL: 'http://localhost:3000' },
}));

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual<typeof import('@v6y/ui-kit-front')>('@v6y/ui-kit-front');

    return {
        ...actual,
        toast: {
            ...actual.toast,
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

const mockRefetch = vi.fn();

describe('VitalityAiSummaryCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRefetch.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const mockQueryResult = (data: unknown, overrides: Record<string, unknown> = {}) => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data,
            error: null,
            refetch: mockRefetch,
            ...overrides,
        });
    };

    it('shows a loading skeleton while the cached summary is being fetched', () => {
        mockQueryResult(null, { isLoading: true });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.getByTestId('ai-summary-card-loading')).toBeInTheDocument();
    });

    it('shows a generate button and empty state when no summary has ever been generated', () => {
        mockQueryResult({ getApplicationAiSummaryByParams: null });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.getByTestId('ai-summary-card-empty')).toBeInTheDocument();
        expect(
            screen.getByText('vitality.appDetailsPage.aiSummaryCard.generateButton'),
        ).toBeInTheDocument();
    });

    it('renders the cached summary along with its generation metadata', () => {
        mockQueryResult({
            getApplicationAiSummaryByParams: {
                _id: 1,
                appId: 42,
                summary: 'Everything looks great.',
                model: 'gpt-4o-mini',
                generatedAt: '2026-01-01T10:00:00.000Z',
            },
        });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.getByTestId('ai-summary-card-content')).toHaveTextContent(
            'Everything looks great.',
        );
        expect(
            screen.getByText('vitality.appDetailsPage.aiSummaryCard.regenerateButton'),
        ).toBeInTheDocument();
    });

    it('shows a score badge next to the title when the cached summary has a score', () => {
        mockQueryResult({
            getApplicationAiSummaryByParams: {
                _id: 1,
                appId: 42,
                summary: 'Everything looks great.',
                score: 9,
                model: 'gpt-4o-mini',
                generatedAt: '2026-01-01T10:00:00.000Z',
            },
        });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.getByTestId('ai-summary-card-score')).toHaveTextContent('9/10');
    });

    it('does not show a score badge when the cached summary has no score', () => {
        mockQueryResult({
            getApplicationAiSummaryByParams: {
                _id: 1,
                appId: 42,
                summary: 'Everything looks great.',
                model: 'gpt-4o-mini',
                generatedAt: '2026-01-01T10:00:00.000Z',
            },
        });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.queryByTestId('ai-summary-card-score')).not.toBeInTheDocument();
    });

    it('shows a retry action when loading the cached summary fails', () => {
        mockQueryResult(null, { error: new Error('network error') });

        render(<VitalityAiSummaryCard applicationId={42} />);

        expect(screen.getByTestId('ai-summary-card-load-error')).toBeInTheDocument();

        fireEvent.click(screen.getByText('vitality.appDetailsPage.aiSummaryCard.retry'));
        expect(mockRefetch).toHaveBeenCalled();
    });

    it('generates a new summary and shows a success toast', async () => {
        const { toast } = await import('@v6y/ui-kit-front');

        mockQueryResult({ getApplicationAiSummaryByParams: null });
        (buildClientQuery as Mock).mockResolvedValue({
            generateApplicationAiSummary: {
                success: true,
                message: 'Summary generated successfully.',
            },
        });

        render(<VitalityAiSummaryCard applicationId={42} />);

        fireEvent.click(screen.getByText('vitality.appDetailsPage.aiSummaryCard.generateButton'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                'vitality.appDetailsPage.aiSummaryCard.toasts.generated',
            );
        });
        expect(mockRefetch).toHaveBeenCalled();
    });

    it('shows a skeleton placeholder while a new summary is being generated', async () => {
        mockQueryResult({ getApplicationAiSummaryByParams: null });

        let resolveGeneration: (value: unknown) => void = () => {};
        (buildClientQuery as Mock).mockReturnValue(
            new Promise((resolve) => {
                resolveGeneration = resolve;
            }),
        );

        render(<VitalityAiSummaryCard applicationId={42} />);

        fireEvent.click(screen.getByText('vitality.appDetailsPage.aiSummaryCard.generateButton'));

        expect(screen.getByTestId('ai-summary-card-generating')).toBeInTheDocument();
        expect(screen.queryByTestId('ai-summary-card-empty')).not.toBeInTheDocument();

        resolveGeneration({
            generateApplicationAiSummary: {
                success: true,
                message: 'Summary generated successfully.',
            },
        });

        await waitFor(() => {
            expect(screen.queryByTestId('ai-summary-card-generating')).not.toBeInTheDocument();
        });
    });

    it('shows an error toast when the generation mutation fails without crashing', async () => {
        const { toast } = await import('@v6y/ui-kit-front');

        mockQueryResult({ getApplicationAiSummaryByParams: null });
        (buildClientQuery as Mock).mockResolvedValue({
            generateApplicationAiSummary: {
                success: false,
                message: 'LiteLLM request timed out',
            },
        });

        render(<VitalityAiSummaryCard applicationId={42} />);

        fireEvent.click(screen.getByText('vitality.appDetailsPage.aiSummaryCard.generateButton'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('LiteLLM request timed out');
        });

        expect(screen.getByTestId('ai-summary-card')).toBeInTheDocument();
    });

    it('shows an error toast when the mutation call itself rejects (network failure)', async () => {
        const { toast } = await import('@v6y/ui-kit-front');

        mockQueryResult({ getApplicationAiSummaryByParams: null });
        (buildClientQuery as Mock).mockRejectedValue(new Error('Network Error'));

        render(<VitalityAiSummaryCard applicationId={42} />);

        fireEvent.click(screen.getByText('vitality.appDetailsPage.aiSummaryCard.generateButton'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Network Error');
        });
    });
});
