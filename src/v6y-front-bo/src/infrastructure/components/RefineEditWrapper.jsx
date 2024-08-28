'use client';

import { Edit, useForm } from '@refinedev/antd';
import { Form } from 'antd';

export default function RefineEditWrapper({ title, formItems, resourceOptions }) {
    const { formProps, saveButtonProps } = useForm(resourceOptions);

    if (!formItems?.length) {
        return null;
    }

    return (
        <Edit title={title} saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" variant="filled">
                {formItems.map((item) => item)}
            </Form>
        </Edit>
    );
}
