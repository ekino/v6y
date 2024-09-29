declare const DeprecatedDependencyResolvers: {
    Query: {
        getDeprecatedDependencyListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").DeprecatedDependencyType[]>;
        getDeprecatedDependencyDetailsByParams: (_: unknown, args: import("@v6y/commons").DeprecatedDependencyType) => Promise<import("@v6y/commons").DeprecatedDependencyType | null>;
    };
    Mutation: {
        createOrEditDeprecatedDependency: (_: unknown, params: {
            deprecatedDependencyInput: import("@v6y/commons").DeprecatedDependencyType;
        }) => Promise<import("@v6y/commons/src/database/models/DeprecatedDependencyModel.ts").DeprecatedDependencyModelType | {
            _id: number;
        } | null>;
        deleteDeprecatedDependency: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default DeprecatedDependencyResolvers;
