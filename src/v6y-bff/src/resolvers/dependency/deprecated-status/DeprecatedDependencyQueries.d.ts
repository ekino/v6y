import { DeprecatedDependencyType, SearchQueryType } from '@v6y/commons';
declare const DeprecatedDependencyQueries: {
    getDeprecatedDependencyListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/DeprecatedDependencyModel.ts").DeprecatedDependencyModelType[]>;
    getDeprecatedDependencyDetailsByParams: (_: unknown, args: DeprecatedDependencyType) => Promise<DeprecatedDependencyType | null>;
};
export default DeprecatedDependencyQueries;
