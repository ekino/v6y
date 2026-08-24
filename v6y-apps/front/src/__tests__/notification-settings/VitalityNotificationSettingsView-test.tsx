import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityNotificationSettingsView from '../../features/notification-settings/components/VitalityNotificationSettingsView';
import {
    buildClientQuery,
    useClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

const settings = {
    _id: 3,
    auditReportEmailsEnabled: true,
    dailyDigestEmailsEnabled: true,
};

describe('VitalityNotificationSettingsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the current preferences of the account', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getCurrentAccountNotificationSettings: settings },
            refetch: vi.fn(),
        });

        render(<VitalityNotificationSettingsView />);

        expect(
            screen.getByLabelText('vitality.notificationSettingsPage.auditReportEmails.label'),
        ).toBeChecked();
        expect(
            screen.getByLabelText('vitality.notificationSettingsPage.dailyDigestEmails.label'),
        ).toBeChecked();
    });

    it('tells the user when the preferences could not be loaded', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getCurrentAccountNotificationSettings: null },
            refetch: vi.fn(),
        });

        render(<VitalityNotificationSettingsView />);

        expect(
            screen.getByText('vitality.notificationSettingsPage.unavailable'),
        ).toBeInTheDocument();
    });

    it('saves the preference when a notification is turned off', async () => {
        const refetch = vi.fn();
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getCurrentAccountNotificationSettings: settings },
            refetch,
        });
        (buildClientQuery as Mock).mockResolvedValue({
            updateAccountNotificationSettings: { ...settings, dailyDigestEmailsEnabled: false },
        });

        render(<VitalityNotificationSettingsView />);

        await userEvent.click(
            screen.getByLabelText('vitality.notificationSettingsPage.dailyDigestEmails.label'),
        );

        await waitFor(() => {
            expect(buildClientQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    variables: { input: { dailyDigestEmailsEnabled: false } },
                }),
            );
        });

        await waitFor(() =>
            expect(
                screen.getByLabelText('vitality.notificationSettingsPage.dailyDigestEmails.label'),
            ).not.toBeChecked(),
        );
    });

    it('restores the previous value when the update is rejected', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getCurrentAccountNotificationSettings: settings },
            refetch: vi.fn(),
        });
        (buildClientQuery as Mock).mockRejectedValue(new Error('network down'));
        vi.spyOn(console, 'error').mockImplementation(() => {});

        render(<VitalityNotificationSettingsView />);

        await userEvent.click(
            screen.getByLabelText('vitality.notificationSettingsPage.auditReportEmails.label'),
        );

        await waitFor(() =>
            expect(
                screen.getByLabelText('vitality.notificationSettingsPage.auditReportEmails.label'),
            ).toBeChecked(),
        );
    });
});
