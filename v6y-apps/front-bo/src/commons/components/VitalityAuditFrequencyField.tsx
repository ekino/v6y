import * as React from 'react';

import { Flex, Form, Input, Switch, Text, TranslateType } from '@v6y/ui-kit';

import { AUDIT_FREQUENCY_EXAMPLES, validateAuditFrequencyCron } from '../utils/AuditFrequencyUtils';

interface VitalityAuditFrequencyFieldProps {
    groupTitle?: string;
    translate: TranslateType;
}

const CRON_FIELD_KEY = 'v6y-applications.fields.app-audit-frequency-cron';

/**
 * Compound Form field letting an admin enable scheduled audits for an
 * application and enter the cron expression driving them, with the common
 * schedules spelled out underneath.
 *
 * The expression is free-form rather than picked from a preset list: the main
 * analyzer accepts any cron it can validate, so restricting the back office to a
 * handful of combinations only hid that capability. What it does not accept is a
 * schedule running more than once per hour, which is checked here too so the
 * admin sees it inline instead of through a failed save.
 *
 * Inserted directly as a `formItems` entry of `AdminCreateWrapper` /
 * `AdminEditWrapper`, so it relies on the surrounding antd `Form` context via
 * `Form.useWatch` instead of receiving form state as props.
 */
const VitalityAuditFrequencyField = ({
    groupTitle,
    translate,
}: VitalityAuditFrequencyFieldProps) => {
    const form = Form.useFormInstance();
    const enabled = Form.useWatch('app-audit-frequency-enabled', form);

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
                        label={translate(`${CRON_FIELD_KEY}.label`)}
                        name="app-audit-frequency-cron"
                        style={{ marginBottom: 8 }}
                        rules={[
                            {
                                required: true,
                                message: translate(`${CRON_FIELD_KEY}.error`),
                            },
                            {
                                validator: (_: unknown, value: string) => {
                                    const error = validateAuditFrequencyCron(value);

                                    return error
                                        ? Promise.reject(
                                              new Error(
                                                  translate(`${CRON_FIELD_KEY}.error-${error}`),
                                              ),
                                          )
                                        : Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input placeholder={translate(`${CRON_FIELD_KEY}.placeholder`)} />
                    </Form.Item>

                    <Flex vertical gap={2} style={{ marginBottom: 24 }}>
                        <Text type="secondary">
                            {translate(`${CRON_FIELD_KEY}.examples.title`)}
                        </Text>
                        {AUDIT_FREQUENCY_EXAMPLES.map(({ labelKey, cron }) => (
                            <Text key={cron} type="secondary">
                                <Text code>{cron}</Text>{' '}
                                {translate(`${CRON_FIELD_KEY}.examples.${labelKey}`)}
                            </Text>
                        ))}
                        <Text type="secondary" italic>
                            {translate(`${CRON_FIELD_KEY}.examples.timezone`)}
                        </Text>
                    </Flex>
                </>
            )}
        </fieldset>
    );
};

export default VitalityAuditFrequencyField;
