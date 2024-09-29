import { DeprecatedDependencyType } from '../types/DeprecatedDependencyType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { DeprecatedDependencyModelType } from './models/DeprecatedDependencyModel.ts';
declare const DeprecatedDependencyProvider: {
    createDeprecatedDependency: (deprecatedDependency: DeprecatedDependencyType) => Promise<DeprecatedDependencyModelType | null>;
    editDeprecatedDependency: (deprecatedDependency: DeprecatedDependencyType) => Promise<{
        _id: number;
    } | null>;
    deleteDeprecatedDependency: ({ _id }: DeprecatedDependencyType) => Promise<{
        _id: number;
    } | null>;
    deleteDeprecatedDependencyList: () => Promise<boolean>;
    getDeprecatedDependencyListByPageAndParams: ({ start, limit, sort, }: SearchQueryType) => Promise<DeprecatedDependencyType[]>;
    getDeprecatedDependencyDetailsByParams: ({ _id, name }: DeprecatedDependencyType) => Promise<DeprecatedDependencyType | null>;
};
export default DeprecatedDependencyProvider;
