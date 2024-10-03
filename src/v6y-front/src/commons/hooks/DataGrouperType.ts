import * as React from 'react';

export interface DataGrouperParams {
    dataSource: unknown[];
    criteria: string;
    hasAllGroup: boolean | undefined;
}

export interface CriteriaGroup {
    key: string;
    value: string;
    label: React.ReactNode;
}

export interface DataGrouperReturn {
    criteriaGroups: CriteriaGroup[];
    groupedDataSource: Record<string, unknown[]>;
    selectedCriteria: CriteriaGroup;
    setSelectedCriteria: React.Dispatch<React.SetStateAction<CriteriaGroup>>;
}
