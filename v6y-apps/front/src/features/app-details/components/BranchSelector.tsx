'use client';

import * as React from 'react';

import { ShuffleIcon } from '@v6y/ui-kit-front';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@v6y/ui-kit-front';

interface BranchSelectorProps {
    branches: string[];
    selectedBranch: string;
    onBranchChange: (branch: string) => void;
}

const BranchSelector = ({ branches, selectedBranch, onBranchChange }: BranchSelectorProps) => {
    return (
        <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="h-10 sm:h-8 w-full sm:w-[320px] border-slate-300 rounded-md px-3 sm:px-4 py-2 text-sm bg-white">
                <div className="flex min-w-0 items-center gap-1">
                    <ShuffleIcon className="w-4 h-4 shrink-0" />
                    <SelectValue className="truncate" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {branches.map((branch) => (
                    <SelectItem 
                        key={branch} 
                        value={branch}
                        className="pr-12 truncate"
                    >
                        {branch}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default BranchSelector;
