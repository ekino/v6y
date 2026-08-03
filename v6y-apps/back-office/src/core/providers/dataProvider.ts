'use client';

import type {
    CreateParams,
    DataProvider,
    DeleteManyParams,
    DeleteParams,
    GetListParams,
    GetManyParams,
    GetManyReferenceParams,
    GetOneParams,
    RaRecord,
    UpdateManyParams,
    UpdateParams,
} from 'ra-core';

import { getResourceConfig } from '../resources/index.ts';
import { createAuthenticatedGraphQLClient } from './graphqlClient.ts';

/** BFF records use `_id`; ra-core requires an `id` field on every record. */
const withRaId = <T extends Record<string, unknown>>(record: T): T & RaRecord => ({
    ...record,
    id: (record._id ?? record.id) as RaRecord['id'],
});

const requireResource = (resourceName: string) => {
    const resource = getResourceConfig(resourceName);
    if (!resource) {
        throw new Error(`Unknown resource "${resourceName}"`);
    }
    return resource;
};

const compareValues = (a: unknown, b: unknown): number => {
    if (a === b) return 0;
    if (a === undefined || a === null) return -1;
    if (b === undefined || b === null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
};

/**
 * Generic, config-driven ra-core DataProvider.
 *
 * The BFF's list queries have inconsistent pagination/sort support across
 * resources (some accept none, some accept sort only, some accept
 * start/limit/sort - and none return a grand total count). To keep behaviour
 * uniform and `total` correct for all 8 resources, `getList` always fetches
 * every record in one GraphQL call, then applies sorting/filtering/pagination
 * client-side. This is appropriate for admin reference data (accounts, FAQs,
 * help entries, ...) which are expected to stay in the hundreds, not millions,
 * of rows.
 */
export const dataProvider: DataProvider = {
    async getList<RecordType extends RaRecord = RaRecord>(
        resourceName: string,
        params: GetListParams,
    ): Promise<{ data: RecordType[]; total: number }> {
        const resource = requireResource(resourceName);
        const client = createAuthenticatedGraphQLClient();

        const variables: Record<string, unknown> = {};
        if (resource.graphql.listSupportsSort && params.sort?.field) {
            variables.sort = `${params.sort.order === 'DESC' ? '-' : ''}${params.sort.field}`;
        }

        const result = await client.request<Record<string, Array<Record<string, unknown>>>>(
            resource.graphql.listQuery,
            variables,
        );
        let data = (result[resource.graphql.listField] ?? []).map(withRaId);
        if (resource.parseRecord) {
            data = data.map((record) => withRaId(resource.parseRecord!(record)));
        }

        // Basic full text filter (matches ra-core's `filter: { q: '...' }` convention).
        const query = typeof params.filter?.q === 'string' ? params.filter.q.toLowerCase() : '';
        if (query) {
            data = data.filter((record) =>
                Object.values(record).some(
                    (value) => typeof value === 'string' && value.toLowerCase().includes(query),
                ),
            );
        }

        if (params.sort?.field && !resource.graphql.listSupportsSort) {
            const { field, order } = params.sort;
            data = [...data].sort((a, b) => {
                const result = compareValues(a[field], b[field]);
                return order === 'DESC' ? -result : result;
            });
        }

        const total = data.length;
        const { page, perPage } = params.pagination ?? { page: 1, perPage: total || 1 };
        const start = (page - 1) * perPage;
        const pageData = data.slice(start, start + perPage);

        return { data: pageData as unknown as RecordType[], total };
    },

    async getOne<RecordType extends RaRecord = RaRecord>(
        resourceName: string,
        params: GetOneParams,
    ): Promise<{ data: RecordType }> {
        const resource = requireResource(resourceName);
        const client = createAuthenticatedGraphQLClient();
        const result = await client.request<Record<string, Record<string, unknown>>>(
            resource.graphql.detailQuery,
            { _id: Number(params.id) },
        );
        const record = result[resource.graphql.detailField];
        if (!record) {
            throw new Error(`${resourceName} #${params.id} not found`);
        }
        const parsedRecord = resource.parseRecord ? resource.parseRecord(record) : record;
        return { data: withRaId(parsedRecord) as unknown as RecordType };
    },

    async getMany(resourceName: string, params: GetManyParams) {
        const results = await Promise.all(
            params.ids.map((id) => dataProvider.getOne(resourceName, { id })),
        );
        return { data: results.map((result) => result.data) };
    },

    async getManyReference(resourceName: string, params: GetManyReferenceParams) {
        // No resource in this admin uses reference fields; fall back to getList.
        return dataProvider.getList(resourceName, {
            filter: params.filter,
            pagination: params.pagination,
            sort: params.sort,
            meta: params.meta,
        });
    },

    async create<ResultRecordType extends RaRecord = RaRecord>(
        resourceName: string,
        params: CreateParams,
    ): Promise<{ data: ResultRecordType }> {
        const resource = requireResource(resourceName);
        if (!resource.graphql.createOrEditMutation || !resource.graphql.createOrEditField) {
            throw new Error(`Resource "${resourceName}" does not support create`);
        }
        const client = createAuthenticatedGraphQLClient();
        const inputData = resource.serializeInput
            ? resource.serializeInput(params.data as Record<string, unknown>)
            : params.data;
        const result = await client.request<Record<string, Record<string, unknown>>>(
            resource.graphql.createOrEditMutation,
            { [resource.graphql.createOrEditArgName as string]: inputData },
        );
        return {
            data: withRaId(
                result[resource.graphql.createOrEditField],
            ) as unknown as ResultRecordType,
        };
    },

    async update<RecordType extends RaRecord = RaRecord>(
        resourceName: string,
        params: UpdateParams,
    ): Promise<{ data: RecordType }> {
        const resource = requireResource(resourceName);
        if (!resource.graphql.createOrEditMutation || !resource.graphql.createOrEditField) {
            throw new Error(`Resource "${resourceName}" does not support update`);
        }
        const client = createAuthenticatedGraphQLClient();
        const inputData = resource.serializeInput
            ? resource.serializeInput(params.data as Record<string, unknown>)
            : (params.data as Record<string, unknown>);
        const result = await client.request<Record<string, Record<string, unknown>>>(
            resource.graphql.createOrEditMutation,
            {
                [resource.graphql.createOrEditArgName as string]: {
                    ...inputData,
                    _id: Number(params.id),
                },
            },
        );
        return {
            data: withRaId(result[resource.graphql.createOrEditField]) as unknown as RecordType,
        };
    },

    async updateMany(resourceName: string, params: UpdateManyParams) {
        await Promise.all(
            params.ids.map((id) =>
                dataProvider.update(resourceName, {
                    id,
                    data: params.data,
                    previousData: { id } as RaRecord,
                }),
            ),
        );
        return { data: params.ids };
    },

    async delete<RecordType extends RaRecord = RaRecord>(
        resourceName: string,
        params: DeleteParams,
    ): Promise<{ data: RecordType }> {
        const resource = requireResource(resourceName);
        if (!resource.graphql.deleteMutation || !resource.graphql.deleteField) {
            throw new Error(`Resource "${resourceName}" does not support delete`);
        }
        const client = createAuthenticatedGraphQLClient();
        const result = await client.request<Record<string, Record<string, unknown>>>(
            resource.graphql.deleteMutation,
            { input: { id: String(params.id) } },
        );
        return {
            data: withRaId(
                result[resource.graphql.deleteField] ?? { _id: params.id },
            ) as unknown as RecordType,
        };
    },

    async deleteMany(resourceName: string, params: DeleteManyParams) {
        await Promise.all(params.ids.map((id) => dataProvider.delete(resourceName, { id })));
        return { data: params.ids };
    },
};

export default dataProvider;
