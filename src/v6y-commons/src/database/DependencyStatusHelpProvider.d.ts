import { DependencyStatusHelpInputType, DependencyStatusHelpType } from '../types/DependencyStatusHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { DependencyStatusHelpModelType } from './models/DependencyStatusHelpModel.ts';
declare const DependencyStatusHelpProvider: {
    initDefaultData: () => Promise<boolean>;
    createDependencyStatusHelp: (dependencyStatusHelp: DependencyStatusHelpInputType) => Promise<DependencyStatusHelpModelType | null>;
    editDependencyStatusHelp: (dependencyStatusHelp: DependencyStatusHelpInputType) => Promise<{
        _id: number;
    } | null>;
    deleteDependencyStatusHelp: ({ _id }: DependencyStatusHelpType) => Promise<{
        _id: number;
    } | null>;
    deleteDependencyStatusHelpList: () => Promise<boolean>;
    getDependencyStatusHelpListByPageAndParams: ({ start, limit, sort, }: SearchQueryType) => Promise<DependencyStatusHelpType[]>;
    getDependencyStatusHelpDetailsByParams: ({ _id, category, }: DependencyStatusHelpType) => Promise<DependencyStatusHelpType | null>;
};
export default DependencyStatusHelpProvider;
