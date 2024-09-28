import { DeprecatedDependencyType, SearchQueryType } from '@v6y/commons';
declare const DeprecatedDependencyMutations: {
    createOrEditDeprecatedDependency: (_: unknown, params: {
        deprecatedDependencyInput: DeprecatedDependencyType;
    }) => Promise<import("@v6y/commons/src/database/models/DeprecatedDependencyModel.ts").DeprecatedDependencyModelType | {
        _id: number;
    } | null>;
    deleteDeprecatedDependency: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default DeprecatedDependencyMutations;
