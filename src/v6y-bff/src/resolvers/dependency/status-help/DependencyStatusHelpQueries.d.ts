import { DependencyStatusHelpType, SearchQueryType } from '@v6y/commons';
declare const DependencyStatusHelpQueries: {
    getDependencyStatusHelpListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/DependencyStatusHelpModel.ts").DependencyStatusHelpModelType[]>;
    getDependencyStatusHelpDetailsByParams: (_: unknown, args: DependencyStatusHelpType) => Promise<DependencyStatusHelpType | null>;
};
export default DependencyStatusHelpQueries;
