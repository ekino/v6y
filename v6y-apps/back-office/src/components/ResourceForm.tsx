'use client';

import { Form, useCreateController, useEditController } from 'ra-core';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@v6y/ui-kit-front';

import type { ResourceConfig } from '../core/resources/types.ts';
import FieldInput from './FieldInput.tsx';

interface ResourceFormProps {
    resource: ResourceConfig;
    mode: 'create' | 'edit';
}

export default function ResourceForm({ resource, mode }: ResourceFormProps) {
    return mode === 'create' ? (
        <ResourceCreateForm resource={resource} />
    ) : (
        <ResourceEditForm resource={resource} />
    );
}

function ResourceCreateForm({ resource }: { resource: ResourceConfig }) {
    const navigate = useNavigate();
    const redirect = () => navigate(`/${resource.name}`);
    const { save, saving } = useCreateController({
        resource: resource.name,
        redirect: false,
        mutationOptions: { onSuccess: redirect },
    });

    const fields = resource.fields.filter((field) => !field.hideInForm);

    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">Create {resource.label}</h1>
            <Form onSubmit={save} className="space-y-4">
                {fields.map((field) => (
                    <FieldInput key={field.name} field={field} />
                ))}
                <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={saving}>
                        Save
                    </Button>
                    <Button type="button" variant="outline" onClick={redirect}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}

function ResourceEditForm({ resource }: { resource: ResourceConfig }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const redirect = () => navigate(`/${resource.name}`);
    const { save, saving, record, isPending } = useEditController({
        resource: resource.name,
        id,
        redirect: false,
        mutationOptions: { onSuccess: redirect },
    });

    if (isPending) {
        return <p>Loading...</p>;
    }

    const fields = resource.fields.filter((field) => !field.hideInForm);

    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">Edit {resource.label}</h1>
            <Form record={record} onSubmit={save} className="space-y-4">
                {fields.map((field) => (
                    <FieldInput key={field.name} field={field} />
                ))}
                <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={saving}>
                        Save
                    </Button>
                    <Button type="button" variant="outline" onClick={redirect}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}
