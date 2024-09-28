import { DependencyType } from '../types/DependencyType.ts';
import { DependencyModelType } from './models/DependencyModel.ts';
declare const DependencyProvider: {
    createDependency: (dependency: DependencyType) => Promise<DependencyModelType | null>;
    insertDependencyList: (dependencyList: DependencyType[]) => Promise<null | undefined>;
    editDependency: (dependency: DependencyType) => Promise<{
        _id: number;
    } | null>;
    deleteDependency: ({ _id }: DependencyType) => Promise<{
        _id: number;
    } | null>;
    deleteDependencyList: () => Promise<boolean>;
    getDependencyListByPageAndParams: ({ appId }: DependencyType) => Promise<DependencyModelType[]>;
};
export default DependencyProvider;
