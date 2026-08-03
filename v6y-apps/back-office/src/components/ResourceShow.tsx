'use client';

import { useShowController } from 'ra-core';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@v6y/ui-kit-front';

import type { ResourceConfig } from '../core/resources/types.ts';

interface LinkValue {
    label?: string;
    value?: string;
    description?: string;
}

const isLinkArray = (value: unknown): value is LinkValue[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null);

function FieldValue({ value }: { value: unknown }) {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">-</span>;
    }
    if (typeof value === 'boolean') {
        return <span>{value ? 'Yes' : 'No'}</span>;
    }
    if (isLinkArray(value)) {
        return (
            <ul className="list-disc pl-5">
                {value.map((link, index) => (
                    <li key={`${link.value}-${index}`}>
                        <a
                            href={link.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline"
                        >
                            {link.label || link.value}
                        </a>
                        {link.description && (
                            <span className="text-muted-foreground"> - {link.description}</span>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
    if (Array.isArray(value)) {
        return <span>{value.join(', ')}</span>;
    }
    if (typeof value === 'object') {
        return <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <span>{String(value)}</span>;
}

export default function ResourceShow({ resource }: { resource: ResourceConfig }) {
    const { id } = useParams();
    const { record, isPending } = useShowController({ resource: resource.name, id });

    if (isPending || !record) {
        return <p>Loading...</p>;
    }

    const fields = resource.fields.filter((field) => !field.hideInShow);

    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">{resource.label}</h1>
            <dl className="space-y-3">
                {fields.map((field) => (
                    <div key={field.name}>
                        <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
                        <dd>
                            <FieldValue value={record[field.name]} />
                        </dd>
                    </div>
                ))}
            </dl>
            <div className="flex gap-2 pt-2">
                <Button asChild variant="outline">
                    <Link to={`/${resource.name}/${record.id}`}>Edit</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link to={`/${resource.name}`}>Back to list</Link>
                </Button>
            </div>
        </div>
    );
}
