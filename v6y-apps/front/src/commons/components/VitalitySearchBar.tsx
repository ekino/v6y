'use client';

import {
  MagnifyingGlassIcon,
  useNavigationAdapter,
  useTranslationProvider,
} from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalityNavigationPaths from '../config/VitalityNavigationPaths';
import { VitalitySearchBarProps } from '../types/VitalitySearchBarProps';
import { Input, Button } from '@v6y/ui-kit-front';

const VitalitySearchBar = ({
  helper,
  label,
  placeholder,
}: VitalitySearchBarProps) => {
  const {
    router,
    pathname,
    getUrlParams,
    createUrlQueryParam,
    removeUrlQueryParam,
  } = useNavigationAdapter();
  const { translate } = useTranslationProvider();
  const [searchText] = getUrlParams(['searchText']);

  const [value, setValue] = React.useState<string>(searchText || '');

  React.useEffect(() => {
    setValue(searchText || '');
  }, [searchText]);

  const handleOnSearchChanged = (v: string) => {
    if (pathname === VitalityNavigationPaths.DASHBOARD) {
      const queryParams = createUrlQueryParam('searchText', v);
      router.push(`/search?${queryParams}`);
      return;
    }

    if (v?.length) {
      const queryParams = createUrlQueryParam('searchText', v);
      router.replace(`${pathname}?${queryParams}`);
    } else {
      const queryParams = removeUrlQueryParam('searchText');
      router.replace(`${pathname}?${queryParams}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleOnSearchChanged(value);
    }
  };

  return (
    <div>
      <h3>{translate('vitality.dashboardPage.searchByProjectName')} :</h3>

      <div className="flex items-center space-y-2">
        <div className="flex flex-1 items-center gap-x-2 h-10">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
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
