"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ApplicationType } from '@v6y/core-logic/src/types';
import {
  useNavigationAdapter,
  useTranslationProvider,
  Spinner,
} from '@v6y/ui-kit-front';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityAppListHeader from './VitalityAppListHeader';
import VitalityAppListPagination from './VitalityAppListPagination';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { formatApplicationDataSource } from '../../../commons/config/VitalityCommonConfig';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
  buildClientQuery,
  useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';

const initialPage = 0;

interface VitalityAppListQueryType {
  isLoading: boolean;
  data?: {
    pages?: unknown[];
  };
  fetchNextPage?: () => void;
  status?: string;
  isFetchingNextPage?: boolean;
  isFetching?: boolean;
}

const VitalityAppList: React.FC<{ source?: string }> = ({ source }) => {
  const [appList, setAppList] = useState<ApplicationType[] | undefined>(undefined);
  const currentAppListPage = useRef<number>(initialPage);

  const { getUrlParams } = useNavigationAdapter();
  const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

  const {
    data: dataAppList,
    fetchNextPage: fetchAppListNextPage,
    status: appListFetchStatus,
    isFetchingNextPage: isAppListFetchingNextPage,
    isFetching: isAppListFetching,
  }: VitalityAppListQueryType = useInfiniteClientQuery({
    queryCacheKey: [
      'getApplicationListByPageAndParams',
      keywords?.length ? keywords : 'empty_keywords',
      searchText?.length ? searchText : 'empty_search_text',
      `${currentAppListPage.current}`,
    ],
    queryBuilder: async () =>
      buildClientQuery({
        queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
        query: GetApplicationListByPageAndParams,
        variables: {
          offset: 0,
          limit: VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
          keywords,
          searchText,
        },
      }),
    getNextPageParam: () => currentAppListPage.current,
  });

  useEffect(() => {
    setAppList(formatApplicationDataSource(dataAppList?.pages || []));
  }, [dataAppList?.pages]);

  useEffect(() => {
    // reset page when filters change
    currentAppListPage.current = 0;
    fetchAppListNextPage?.();
  }, [keywords, searchText, fetchAppListNextPage]);

  const isAppListLoading =
    appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

  const onExportApplicationsClicked = () => {
    exportAppListDataToCSV(appList || []);
  };

  const onLoadMore = () => {
    currentAppListPage.current = appList?.length ?? 0;
    fetchAppListNextPage?.();
  };

  const onPrevious = () => {
    currentAppListPage.current = 0;
    setAppList([]);
    fetchAppListNextPage?.();
  };

  const { translate } = useTranslationProvider();

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <VitalityAppListHeader onExportApplicationsClicked={onExportApplicationsClicked} />

      {isAppListLoading && !appList ? (
        <div className="py-20">
          <Spinner />
        </div>
      ) : Array.isArray(appList) && appList.length === 0 ? (
        <div className="w-full max-w-4xl px-4 py-20 text-center text-zinc-500">
          {translate('vitality.appListPage.empty')}
        </div>
      ) : (
        <div className="w-full">
          {appList && (
            <ul className="gap-4">
              {appList.map((app) => (
                <li key={app._id}>
                  <VitalityAppInfos app={app} source={source} />
                </li>
              ))}
            </ul>
          )}

          {appList && (
            <VitalityAppListPagination onPrevious={onPrevious} onLoadMore={onLoadMore} />
          )}
        </div>
      )}
    </div>
  );
};

export default VitalityAppList;
