import * as React from 'react';

import { Flex, Form, Input, Switch, Text, TranslateType } from '@v6y/ui-kit';

interface VitalityToggleTextFieldProps {
    groupTitle?: string;
    translate: TranslateType;
    switchFieldName: string;
    switchLabelKey: string;
    textFieldName: string;
    textFieldKey: string;
}

/**
 * Compound Form field pairing an enable switch with a text input that only
 * appears (and is only sent) once the switch is on — used for the optional
 * Slack channel setting on the application form. The text input is required
 * while the switch is on, so the feature can never be saved enabled with an
 * empty value.
 *
 * Toggling off keeps the previously entered value in the form state; it is
 * simply hidden, so re-enabling brings it right back instead of forcing the
 * admin to retype it.
 */
const VitalityToggleTextField = ({
    groupTitle,
    translate,
    switchFieldName,
    switchLabelKey,
    textFieldName,
    textFieldKey,
}: VitalityToggleTextFieldProps) => {
    const form = Form.useFormInstance();
    const enabled = Form.useWatch(switchFieldName, form);

    return (
        <fieldset>
            {groupTitle && <legend>{groupTitle}</legend>}

            <Flex align="center" gap={8} style={{ marginBottom: enabled ? 12 : 24 }}>
                <Form.Item
                    name={switchFieldName}
                    valuePropName="checked"
                    initialValue={false}
                    style={{ marginBottom: 0 }}
                >
                    <Switch />
                </Form.Item>
                <Text>{translate(switchLabelKey)}</Text>
            </Flex>

            {!!enabled && (
                <Form.Item
                    name={textFieldName}
                    label={translate(`${textFieldKey}.label`)}
                    rules={[{ required: true, message: translate(`${textFieldKey}.required`) }]}
                    style={{ marginBottom: 24 }}
                >
                    <Input placeholder={translate(`${textFieldKey}.placeholder`)} />
                </Form.Item>
            )}
        </fieldset>
    );
};

export default VitalityToggleTextField;
