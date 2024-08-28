'use client';

import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';

export default function RefineCreateWrapper({ title, formItems, resourceOptions }) {
    const { formProps, saveButtonProps } = useForm(resourceOptions);

    if (!formItems?.length) {
        return null;
    }

    return (
        <Create title={title} saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" variant="filled">
                {formItems.map((item) => item)}
            </Form>
        </Create>
    );
}
