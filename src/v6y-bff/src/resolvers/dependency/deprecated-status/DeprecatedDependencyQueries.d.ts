import { DeprecatedDependencyType, SearchQueryType } from '@v6y/commons';
declare const DeprecatedDependencyQueries: {
    getDeprecatedDependencyListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<DeprecatedDependencyType[]>;
    getDeprecatedDependencyDetailsByParams: (_: unknown, args: DeprecatedDependencyType) => Promise<DeprecatedDependencyType | null>;
};
export default DeprecatedDependencyQueries;
