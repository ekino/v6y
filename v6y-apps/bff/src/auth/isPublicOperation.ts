import { FieldNode, Kind, OperationDefinitionNode, parse } from 'graphql';

/**
 * Root fields an anonymous caller may run: logging in, and schema introspection.
 */
const PUBLIC_ROOT_FIELDS = new Set(['loginAccount', '__schema', '__type', '__typename']);

type GraphQLRequestBody = {
    query?: unknown;
    operationName?: unknown;
};

const selectOperation = (
    operations: OperationDefinitionNode[],
    operationName: unknown,
): OperationDefinitionNode | undefined => {
    if (typeof operationName === 'string' && operationName.length) {
        return operations.find((operation) => operation.name?.value === operationName);
    }

    return operations.length === 1 ? operations[0] : undefined;
};

/**
 * Whether the operation the server is about to execute only selects public root
 * fields, so it may run without credentials.
 *
 * The decision reads the parsed document, never the client-supplied
 * `operationName` alone: a caller is free to name any operation `LoginAccount`.
 * It looks at field names, not aliases, and treats fragments, batches and
 * unparsable documents as protected, so anything unusual falls back to
 * authentication.
 * @param body
 */
export const isPublicOperation = (body: unknown): boolean => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return false;
    }

    const { query, operationName } = body as GraphQLRequestBody;

    if (typeof query !== 'string') {
        return false;
    }

    let operations: OperationDefinitionNode[];

    try {
        operations = parse(query).definitions.filter(
            (definition): definition is OperationDefinitionNode =>
                definition.kind === Kind.OPERATION_DEFINITION,
        );
    } catch {
        return false;
    }

    const operation = selectOperation(operations, operationName);

    if (!operation?.selectionSet.selections.length) {
        return false;
    }

    return operation.selectionSet.selections.every(
        (selection) =>
            selection.kind === Kind.FIELD &&
            PUBLIC_ROOT_FIELDS.has((selection as FieldNode).name.value),
    );
};
