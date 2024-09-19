import { Form, Input, Select } from 'antd';
import React from 'react';

const VitalityFormFieldSet = ({ groupTitle, items, selectOptions }) => (
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
