import * as React from 'react';

import { Form, Input, Select, SelectOptionType } from '@v6y/ui-kit';

interface VitalityFormFieldSetProps {
    groupTitle?: string;
    items: SelectOptionType[];
    selectOptions?: SelectOptionType[];
}

const VitalityFormFieldSet = ({ groupTitle, items, selectOptions }: VitalityFormFieldSetProps) => (
    <fieldset>
        <legend>{groupTitle}</legend>
        {items?.map((item) => (
            <Form.Item
                key={`${item.name}-${item.id}`}
                label={item.label}
                name={item.name}
                rules={item.rules}
                initialValue={item.defaultValue}
            >
                {item.type === 'select' && (
                    <Select
                        disabled={item.disabled || false}
                        //defaultValue={item.defaultValue}
                        placeholder={item.placeholder}
                        options={selectOptions}
                        mode={item.mode || undefined}
                    />
                )}

                {item.type === 'textarea' && (
                    <Input.TextArea
                        disabled={item.disabled || false}
                        placeholder={item.placeholder}
                        rows={4}
                    />
                )}

                {item.type === 'password' && (
                    <Input.Password
                        disabled={item.disabled || false}
                        placeholder={item.placeholder}
                    />
                )}

                {!item.type?.length && (
                    <Input disabled={item.disabled || false} placeholder={item.placeholder} />
                )}
            </Form.Item>
        ))}
    </fieldset>
);

export default VitalityFormFieldSet;
