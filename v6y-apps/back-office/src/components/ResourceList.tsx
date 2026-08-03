'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useDelete, useListController } from 'ra-core';
import { Link } from 'react-router-dom';

import {
    Button,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@v6y/ui-kit-front';

import type { ResourceConfig } from '../core/resources/types.ts';

const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return `${value.length} item(s)`;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

export default function ResourceList({ resource }: { resource: ResourceConfig }) {
    const listController = useListController({
        resource: resource.name,
        sort: { field: 'id', order: 'ASC' },
        perPage: 25,
    });
    const { data, total, isPending, page, perPage, setPage } = listController;
    const [deleteOne] = useDelete();

    const columns = resource.fields.filter((field) => !field.hideInList);
    const pageCount = Math.max(1, Math.ceil((total ?? 0) / perPage));

    const handleDelete = (id: string | number) => {
        if (!window.confirm('Delete this record?')) return;
        deleteOne(resource.name, { id }, { onSuccess: () => listController.refetch() });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{resource.label}</h1>
                {resource.canCreate && (
                    <Button asChild size="sm">
                        <Link to={`/${resource.name}/create`}>
                            <Plus className="mr-1 h-4 w-4" />
                            Create
                        </Link>
                    </Button>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((field) => (
                            <TableHead key={field.name}>{field.label}</TableHead>
                        ))}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1}>Loading...</TableCell>
                        </TableRow>
                    )}
                    {!isPending && (data?.length ?? 0) === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1}>No records found.</TableCell>
                        </TableRow>
                    )}
                    {data?.map((record) => (
                        <TableRow key={record.id}>
                            {columns.map((field) => (
                                <TableCell key={field.name}>
                                    {formatCellValue(record[field.name])}
                                </TableCell>
                            ))}
                            <TableCell className="flex justify-end gap-2">
                                <Button asChild variant="ghost" size="icon">
                                    <Link to={`/${resource.name}/${record.id}/show`}>Show</Link>
                                </Button>
                                <Button asChild variant="ghost" size="icon">
                                    <Link to={`/${resource.name}/${record.id}`}>
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                                {resource.canDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(record.id)}
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {pageCount > 1 && (
                <Pagination>
                    <PaginationContent>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === page}
                                    size="icon"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setPage(p);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
