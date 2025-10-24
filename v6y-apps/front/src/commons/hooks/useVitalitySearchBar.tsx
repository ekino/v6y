'use client';

import { useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalityNavigationPaths from '../config/VitalityNavigationPaths';

export const useVitalitySearchBar = () => {
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const inputProps = {
    value,
    onChange,
    onKeyDown,
    placeholder: translate('search.placeholder'),
  };

  return {
    inputProps,
    handleOnSearchChanged,
  };
};
