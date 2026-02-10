'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@v6y/ui-kit-front/components/atoms/button';
import { Input } from '@v6y/ui-kit-front/components/atoms/input';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';

import { useVitalitySearchBar } from '../hooks/useVitalitySearchBar';
import { VitalitySearchBarProps } from '../types/VitalitySearchBarProps';

const VitalitySearchBar = ({ helper, label, placeholder }: VitalitySearchBarProps) => {
    const { inputProps, handleOnSearchChanged } = useVitalitySearchBar();
    const { translate } = useTranslationProvider();
    const { value } = inputProps;

    return (
        <div>
            <h3>{translate('vitality.dashboardPage.searchByProjectName')} :</h3>

            <div className="flex items-center space-y-2">
                <div className="flex flex-1 items-center gap-x-2 h-10">
                    <Input
                        {...inputProps}
                        placeholder={placeholder ?? translate('search.placeholder')}
                        aria-label={label}
                        className="border-gray-400"
                    />

                    <Button
                        className="border shadow-none border-gray-400 w-10 hover:bg-black hover:text-white"
                        onClick={() => handleOnSearchChanged(value)}
                    >
                        <MagnifyingGlassIcon className="scale-150" />
                    </Button>
                </div>
            </div>

            {helper && <p className="text-xs text-gray-500 mt-2">{helper}</p>}
        </div>
    );
};

export default VitalitySearchBar;
