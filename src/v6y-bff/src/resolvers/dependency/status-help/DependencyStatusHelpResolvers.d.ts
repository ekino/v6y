declare const DependencyStatusHelpResolvers: {
    Query: {
        getDependencyStatusHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons/src/database/models/DependencyStatusHelpModel.ts").DependencyStatusHelpModelType[]>;
        getDependencyStatusHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").DependencyStatusHelpType) => Promise<import("@v6y/commons").DependencyStatusHelpType | null>;
    };
    Mutation: {
        createOrEditDependencyStatusHelp: (_: unknown, params: {
            dependencyStatusHelpInput: import("@v6y/commons").DependencyStatusHelpInputType;
        }) => Promise<import("@v6y/commons/src/database/models/DependencyStatusHelpModel.ts").DependencyStatusHelpModelType | {
            _id: number;
        } | null>;
        deleteDependencyStatusHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default DependencyStatusHelpResolvers;
