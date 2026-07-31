import * as React from 'react';

import { Flex, Form, Input, Select, Switch, Text, TranslateType } from '@v6y/ui-kit';

import {
    AuditFrequencyPeriod,
    getAuditFrequencyCounts,
    getAuditFrequencyCron,
    getAuditFrequencyPeriods,
    isCustomAuditFrequencyCron,
} from '../utils/AuditFrequencyUtils';

interface VitalityAuditFrequencyFieldProps {
    groupTitle?: string;
    translate: TranslateType;
}

interface AuditFrequencyWatchedValues {
    count?: number;
    enabled?: boolean;
    period?: AuditFrequencyPeriod;
    storedCron?: string;
}

/**
 * Compound Form field letting an admin enable scheduled audits for an
 * application, pick how many times per day/week/month the audit should run,
 * and see the resulting cron expression that will be sent to the main
 * analyzer (see PR #413's queue-triggered application analysis).
 *
 * Inserted directly as a `formItems` entry of `AdminCreateWrapper` /
 * `AdminEditWrapper`, so it relies on the surrounding antd `Form` context via
 * `Form.useFormInstance` / `Form.useWatch` instead of receiving form state as
 * props.
 */
const VitalityAuditFrequencyField = ({
    groupTitle,
    translate,
}: VitalityAuditFrequencyFieldProps) => {
    const form = Form.useFormInstance();
    // A single selector-based watch (instead of one `Form.useWatch` call per
    // field) so only these primitive values are diffed on each form change.
    const { enabled, period, count, storedCron } =
        Form.useWatch(
            (allValues: Record<string, unknown>): AuditFrequencyWatchedValues => ({
                enabled: allValues['app-audit-frequency-enabled'] as boolean | undefined,
                period: allValues['app-audit-frequency-period'] as AuditFrequencyPeriod | undefined,
                count: allValues['app-audit-frequency-count'] as number | undefined,
                storedCron: allValues['app-audit-frequency-cron'] as string | undefined,
            }),
            form,
        ) || ({} as AuditFrequencyWatchedValues);

    // Reset the selected count whenever the period changes, deferred to an
    // effect (rather than done imperatively inside the period Select's own
    // `onChange`) so it doesn't re-enter the FormStore's notification cycle
    // while it's still dispatching the period field's own change.
    const previousPeriodRef = React.useRef(period);
    React.useEffect(() => {
        const previousPeriod = previousPeriodRef.current;
        previousPeriodRef.current = period;

        // `AdminEditWrapper` hydrates the form from the API in its own effect,
        // i.e. after this component's first render, so the first period this
        // effect observes is `undefined` and the second one is the saved value.
        // Treating that transition as a period change used to wipe the saved
        // count on every visit to the Edit page, leaving the count Select empty
        // and its `required` rule failing on any subsequent save.
        if (previousPeriod === undefined || previousPeriod === period) {
            return;
        }

        form?.setFieldValue('app-audit-frequency-count', undefined);
    }, [period, form]);

    const periodOptions = getAuditFrequencyPeriods().map((item) => ({
        value: item,
        label: translate(`v6y-applications.fields.app-audit-frequency-period.options.${item}`),
    }));
    const countOptions = getAuditFrequencyCounts(period).map((item) => ({
        value: item,
        label: String(item),
    }));

    const presetCron = getAuditFrequencyCron(period, count);
    const hasCustomCron = isCustomAuditFrequencyCron(storedCron);
    // Once a full preset is selected it replaces the custom expression on save,
    // so stop advertising the latter.
    const showCustomCron = hasCustomCron && !presetCron;

    return (
        <fieldset>
            <legend>{groupTitle}</legend>

            <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
                <Form.Item
                    name="app-audit-frequency-enabled"
                    valuePropName="checked"
                    initialValue={false}
                    style={{ marginBottom: 0 }}
                >
                    <Switch />
                </Form.Item>
                <Text>
                    {translate('v6y-applications.fields.app-audit-frequency-enabled.label')}
                </Text>
            </Flex>

            {/* Carries a saved expression the presets cannot express, so it is
                preserved instead of being dropped on the next save. */}
            <Form.Item name="app-audit-frequency-cron" hidden>
                <Input />
            </Form.Item>

            {!!enabled && (
                <>
                    <Form.Item
                        label={translate(
                            'v6y-applications.fields.app-audit-frequency-period.label',
                        )}
                        name="app-audit-frequency-period"
                        rules={
                            hasCustomCron
                                ? []
                                : [
                                      {
                                          required: true,
                                          message: translate(
                                              'v6y-applications.fields.app-audit-frequency-period.error',
                                          ),
                                      },
                                  ]
                        }
                    >
                        <Select
                            placeholder={translate(
                                'v6y-applications.fields.app-audit-frequency-period.placeholder',
                            )}
                            options={periodOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label={translate('v6y-applications.fields.app-audit-frequency-count.label')}
                        name="app-audit-frequency-count"
                        rules={
                            hasCustomCron
                                ? []
                                : [
                                      {
                                          required: true,
                                          message: translate(
                                              'v6y-applications.fields.app-audit-frequency-count.error',
                                          ),
                                      },
                                  ]
                        }
                    >
                        <Select
                            disabled={!period}
                            placeholder={translate(
                                'v6y-applications.fields.app-audit-frequency-count.placeholder',
                            )}
                            options={countOptions}
                        />
                    </Form.Item>

                    {showCustomCron && (
                        <Text type="warning">
                            {translate('v6y-applications.fields.app-audit-frequency-custom', {
                                cron: storedCron,
                            } as never)}
                        </Text>
                    )}

                    {!!presetCron && (
                        <Text type="secondary">
                            {translate('v6y-applications.fields.app-audit-frequency-preview', {
                                cron: presetCron,
                            } as never)}
                        </Text>
                    )}
                </>
            )}
        </fieldset>
    );
};

export default VitalityAuditFrequencyField;
