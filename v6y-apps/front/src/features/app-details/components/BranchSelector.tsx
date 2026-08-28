'use client';

import * as React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@v6y/ui-kit-front';

interface BranchSelectorProps {
    branches: string[];
    selectedBranch: string;
    onBranchChange: (branch: string) => void;
}

const BranchSelector = ({ branches, selectedBranch, onBranchChange }: BranchSelectorProps) => {
    return (
        <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="h-10 sm:h-8 w-fit border-slate-300 rounded-md px-3 sm:px-4 py-2 text-sm bg-white">
                <SelectValue className="truncate" />
            </SelectTrigger>
            <SelectContent>
                {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                        {branch}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default BranchSelector;
