import { DependencyStatusHelpInputType, SearchQueryType } from '@v6y/commons';
declare const DependencyStatusHelpMutations: {
    createOrEditDependencyStatusHelp: (_: unknown, params: {
        dependencyStatusHelpInput: DependencyStatusHelpInputType;
    }) => Promise<import("@v6y/commons/src/database/models/DependencyStatusHelpModel.ts").DependencyStatusHelpModelType | {
        _id: number;
    } | null>;
    deleteDependencyStatusHelp: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default DependencyStatusHelpMutations;
