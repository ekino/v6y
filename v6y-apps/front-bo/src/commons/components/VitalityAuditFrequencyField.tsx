import * as React from 'react';

import { Flex, Form, Select, Switch, Text, TranslateType } from '@v6y/ui-kit';

import {
    AuditFrequencyPeriod,
    getAuditFrequencyCounts,
    getAuditFrequencyCron,
    getAuditFrequencyPeriods,
} from '../utils/AuditFrequencyUtils';

interface VitalityAuditFrequencyFieldProps {
    groupTitle?: string;
    translate: TranslateType;
}

interface AuditFrequencyWatchedValues {
    count?: number;
    enabled?: boolean;
    period?: AuditFrequencyPeriod;
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
    // field) so only these 3 primitive values are diffed on each form change.
    const { enabled, period, count } =
        Form.useWatch(
            (allValues: Record<string, unknown>): AuditFrequencyWatchedValues => ({
                enabled: allValues['app-audit-frequency-enabled'] as boolean | undefined,
                period: allValues['app-audit-frequency-period'] as AuditFrequencyPeriod | undefined,
                count: allValues['app-audit-frequency-count'] as number | undefined,
            }),
            form,
        ) || ({} as AuditFrequencyWatchedValues);

    // Reset the selected count whenever the period changes, deferred to an
    // effect (rather than done imperatively inside the period Select's own
    // `onChange`) so it doesn't re-enter the FormStore's notification cycle
    // while it's still dispatching the period field's own change.
    const previousPeriodRef = React.useRef(period);
    React.useEffect(() => {
        if (previousPeriodRef.current !== period) {
            previousPeriodRef.current = period;
            form?.setFieldValue('app-audit-frequency-count', undefined);
        }
    }, [period, form]);

    const periodOptions = getAuditFrequencyPeriods().map((item) => ({
        value: item,
        label: translate(`v6y-applications.fields.app-audit-frequency-period.options.${item}`),
    }));
    const countOptions = getAuditFrequencyCounts(period).map((item) => ({
        value: item,
        label: String(item),
    }));
    const cron = getAuditFrequencyCron(period, count);

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

            {!!enabled && (
                <>
                    <Form.Item
                        label={translate(
                            'v6y-applications.fields.app-audit-frequency-period.label',
                        )}
                        name="app-audit-frequency-period"
                        rules={[
                            {
                                required: true,
                                message: translate(
                                    'v6y-applications.fields.app-audit-frequency-period.error',
                                ),
                            },
                        ]}
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
                        rules={[
                            {
                                required: true,
                                message: translate(
                                    'v6y-applications.fields.app-audit-frequency-count.error',
                                ),
                            },
                        ]}
                    >
                        <Select
                            disabled={!period}
                            placeholder={translate(
                                'v6y-applications.fields.app-audit-frequency-count.placeholder',
                            )}
                            options={countOptions}
                        />
                    </Form.Item>

                    {!!cron && (
                        <Text type="secondary">
                            {translate('v6y-applications.fields.app-audit-frequency-preview', {
                                cron,
                            } as never)}
                        </Text>
                    )}
                </>
            )}
        </fieldset>
    );
};

export default VitalityAuditFrequencyField;
