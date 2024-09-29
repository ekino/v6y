import { DependencyStatusHelpType, SearchQueryType } from '@v6y/commons';
declare const DependencyStatusHelpQueries: {
    getDependencyStatusHelpListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<DependencyStatusHelpType[]>;
    getDependencyStatusHelpDetailsByParams: (_: unknown, args: DependencyStatusHelpType) => Promise<DependencyStatusHelpType | null>;
};
export default DependencyStatusHelpQueries;
