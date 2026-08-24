'use client';

import * as React from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Label,
    Settings,
    Spinner,
    toast,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetCurrentAccountNotificationSettings from '../api/getCurrentAccountNotificationSettings';
import UpdateAccountNotificationSettings from '../api/updateAccountNotificationSettings';

export interface NotificationSettings {
    _id: number;
    auditReportEmailsEnabled: boolean;
    dailyDigestEmailsEnabled: boolean;
}

type NotificationSettingKey = keyof Omit<NotificationSettings, '_id'>;

const VitalityNotificationSettingsView = () => {
    const { translate } = useTranslationProvider();

    const { isLoading, data, refetch } = useClientQuery<{
        getCurrentAccountNotificationSettings: NotificationSettings | null;
    }>({
        queryCacheKey: ['getCurrentAccountNotificationSettings'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetCurrentAccountNotificationSettings,
                variables: {},
            }),
    });

    const settings = data?.getCurrentAccountNotificationSettings ?? null;

    // Mirrors the server value so a toggle reads as immediate; the server answer
    // then replaces it, and a rejected update snaps the box back rather than
    // leaving the UI claiming a preference that was never saved.
    const [pendingSettings, setPendingSettings] = React.useState<NotificationSettings | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    const displayedSettings = pendingSettings ?? settings;

    const onSettingToggled = async (key: NotificationSettingKey, checked: boolean) => {
        if (!displayedSettings) {
            return;
        }

        const previousSettings = displayedSettings;
        setPendingSettings({ ...displayedSettings, [key]: checked });
        setIsSaving(true);

        try {
            const response = await buildClientQuery<{
                updateAccountNotificationSettings: NotificationSettings | null;
            }>({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: UpdateAccountNotificationSettings,
                variables: { input: { [key]: checked } },
            });

            const updatedSettings = response?.updateAccountNotificationSettings;

            if (!updatedSettings) {
                throw new Error('The notification settings were not saved');
            }

            setPendingSettings(updatedSettings);
            await refetch();
            toast.success(translate('vitality.notificationSettingsPage.saved'));
        } catch (error) {
            console.error('Unable to update the notification settings:', error);
            setPendingSettings(previousSettings);
            toast.error(translate('vitality.notificationSettingsPage.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-200 pb-5">
                    <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-950">
                        <Settings className="h-5 w-5" aria-hidden="true" />
                        {translate('vitality.notificationSettingsPage.pageTitle')}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm leading-7 text-slate-600">
                        {translate('vitality.notificationSettingsPage.pageDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {isLoading && <Spinner />}

                    {!isLoading && !displayedSettings && (
                        <p className="text-sm text-slate-600">
                            {translate('vitality.notificationSettingsPage.unavailable')}
                        </p>
                    )}

                    {!isLoading && displayedSettings && (
                        <div className="space-y-5">
                            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <Checkbox
                                    id="auditReportEmailsEnabled"
                                    className="mt-1"
                                    checked={displayedSettings.auditReportEmailsEnabled}
                                    disabled={isSaving}
                                    onCheckedChange={(checked) =>
                                        onSettingToggled(
                                            'auditReportEmailsEnabled',
                                            checked === true,
                                        )
                                    }
                                />
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="auditReportEmailsEnabled"
                                        className="text-sm font-medium text-slate-900"
                                    >
                                        {translate(
                                            'vitality.notificationSettingsPage.auditReportEmails.label',
                                        )}
                                    </Label>
                                    <p className="text-sm text-slate-600">
                                        {translate(
                                            'vitality.notificationSettingsPage.auditReportEmails.description',
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <Checkbox
                                    id="dailyDigestEmailsEnabled"
                                    className="mt-1"
                                    checked={displayedSettings.dailyDigestEmailsEnabled}
                                    disabled={isSaving}
                                    onCheckedChange={(checked) =>
                                        onSettingToggled(
                                            'dailyDigestEmailsEnabled',
                                            checked === true,
                                        )
                                    }
                                />
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="dailyDigestEmailsEnabled"
                                        className="text-sm font-medium text-slate-900"
                                    >
                                        {translate(
                                            'vitality.notificationSettingsPage.dailyDigestEmails.label',
                                        )}
                                    </Label>
                                    <p className="text-sm text-slate-600">
                                        {translate(
                                            'vitality.notificationSettingsPage.dailyDigestEmails.description',
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalityNotificationSettingsView;
