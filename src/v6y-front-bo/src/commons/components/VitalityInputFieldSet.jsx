import { Form, Input } from 'antd';
import React from 'react';

const VitalityInputFieldSet = ({ groupTitle, items }) => (
    <fieldset>
        <legend>{groupTitle}</legend>
        {items?.map((item) => (
            <Form.Item
                key={`${item.name}-${item.id}`}
                label={item.label}
                name={item.name}
                initialValue={item.initialValue}
                rules={item.rules}
            >
                <Input placeholder={item.placeholder} />
            </Form.Item>
        ))}
    </fieldset>
);

export default VitalityInputFieldSet;
