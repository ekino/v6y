'use client';

import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';

export default function RefineCreateWrapper({ formItems }) {
    const { formProps, saveButtonProps } = useForm({});

    if (!formItems?.length) {
        return null;
    }

    return (
        <Create saveButtonProps={saveButtonProps}>
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
        </Create>
    );
}
