'use client';

import { Edit, useForm } from '@refinedev/antd';
import { Form } from 'antd';

export default function RefineEditWrapper({ formItems }) {
    const { formProps, saveButtonProps } = useForm({});

    if (!formItems?.length) {
        return null;
    }

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                {formItems.map((item, index) => (
                    <Form.Item
                        key={`${item.label}-${index}`}
                        label={item.label}
                        name={item.name}
                        rules={item.rules}
                    >
                        {item.children}
                    </Form.Item>
                ))}
            </Form>
        </Edit>
    );
}
