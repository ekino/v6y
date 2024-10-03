import { Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import * as React from 'react';

interface VitalityFormFieldSetProps {
    groupTitle?: string;
    items: DefaultOptionType[];
    selectOptions?: DefaultOptionType[];
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
            >
                {item.type === 'select' && (
                    <Select
                        disabled={item.disabled || false}
                        placeholder={item.placeholder}
                        options={selectOptions}
                    />
                )}

                {item.type === 'textarea' && (
                    <Input.TextArea
                        disabled={item.disabled || false}
                        placeholder={item.placeholder}
                        rows={4}
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
