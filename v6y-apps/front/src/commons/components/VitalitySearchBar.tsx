"use client";

import { Input, Button } from "@v6y/ui-kit-front";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


// You may need to adjust the import path for VitalityNavigationPaths and VitalitySearchBarProps if still needed
import VitalityNavigationPaths from '../config/VitalityNavigationPaths';
import { VitalitySearchBarProps } from '../types/VitalitySearchBarProps';



import React, { useState, FormEvent } from "react";

const VitalitySearchBar = ({ helper, label, placeholder }: VitalitySearchBarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get("searchText") || "");

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = searchText.trim();
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        if (value.length) {
            params.set("searchText", value);
        } else {
            params.delete("searchText");
        }
        if (pathname === VitalityNavigationPaths.DASHBOARD) {
            router.push(`/search?${params.toString()}`);
        } else {
            router.replace(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col items-center w-full max-w-xl mx-auto space-y-2">
            <label htmlFor="vitality_search" className="font-medium">
                {label}
            </label>
            {helper && <span className="text-sm text-gray-500">{helper}</span>}
            <div className="flex w-full space-x-2">
                <Input
                    id="vitality_search"
                    name="vitality_search"
                    placeholder={placeholder}
                    value={searchText}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
                    className="flex-1"
                />
                <Button type="submit" variant="default">
                    Search
                </Button>
            </div>
        </form>
    );
};

export default VitalitySearchBar;
