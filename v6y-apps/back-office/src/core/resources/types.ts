/**
 * Generic, config-driven CRUD engine types.
 *
 * Instead of hand writing 8 resources x 4 views (list/create/edit/show), every
 * resource is described by a `ResourceConfig` object (fields + GraphQL
 * documents) and rendered by the shared `ResourceList` / `ResourceForm` /
 * `ResourceShow` components.
 */

export type FieldType =
    | 'text'
    | 'textarea'
    | 'password'
    | 'number'
    | 'boolean'
    | 'select'
    | 'links'
    | 'readonly';

export interface SelectFieldOption {
    label: string;
    value: string;
}

export interface FieldConfig {
    /** GraphQL field name, also used as the react-hook-form field name. */
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    /** Hide this field in the list table. */
    hideInList?: boolean;
    /** Hide this field in the create/edit form. */
    hideInForm?: boolean;
    /** Hide this field in the show/detail view. */
    hideInShow?: boolean;
    /** Static options for `select` fields. Ignored if `loadOptions` is set. */
    options?: SelectFieldOption[];
}

export interface ResourceGraphQLConfig {
    /** Document + root field returning an array of records for the list view. */
    listQuery: string;
    listField: string;
    /** Whether the list query accepts $start/$limit pagination variables. */
    listSupportsPagination?: boolean;
    /** Whether the list query accepts a $sort: String variable. */
    listSupportsSort?: boolean;
    /** Document + root field returning a single record for the show/edit views. */
    detailQuery: string;
    detailField: string;
    /** Create/edit mutation, its root field, and the name of its single input variable/argument. */
    createOrEditMutation?: string;
    createOrEditField?: string;
    createOrEditArgName?: string;
    createOrEditInputType?: string;
    /** Delete mutation and root field. Always takes `{ input: { id: String! } }`. */
    deleteMutation?: string;
    deleteField?: string;
}

export interface ResourceConfig {
    /** URL segment + ra-core resource name, e.g. "v6y-accounts". */
    name: string;
    label: string;
    fields: FieldConfig[];
    graphql: ResourceGraphQLConfig;
    canCreate: boolean;
    canDelete: boolean;
}

export interface RaRecordLike {
    id: string | number;
    [key: string]: unknown;
}
