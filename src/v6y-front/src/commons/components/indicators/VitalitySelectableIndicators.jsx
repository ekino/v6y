import { Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';

import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import VitalityApiConfig from '../../config/VitalityApiConfig.js';
import VitalityEmptyView from '../VitalityEmptyView.jsx';
import VitalityLoader from '../VitalityLoader.jsx';
import GetIndicatorListByParams from './getIndicatorListByParams.js';

const VitalitySelectableIndicators = () => {
    const [selectedIndicators, setSelectedIndicators] = useState([]);
    const [indicatorsList, setIndicatorsList] = useState([]);

    const { router, pathname, getUrlParams, creatUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [keywordsUrlParams] = getUrlParams(['keywords']);

    const { isLoading: isIndicatorsLoading, data: dataIndicators } = useClientQuery({
        queryCacheKey: ['getIndicatorListByParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetIndicatorListByParams,
                queryParams: {
                    appId: null,
                },
            }),
    });

    useEffect(() => {
        const data = [
            ...(new Set(
                dataIndicators?.getApplicationDetailsKeywordsByParams?.map((item) => item.label) ||
                    [],
            ) || []),
        ].map((item) => ({ label: item, value: item }));

        setIndicatorsList(data);
    }, [dataIndicators?.getApplicationDetailsKeywordsByParams]);

    useEffect(() => {
        const defaultSelectedIndicators = keywordsUrlParams?.split(',');
        setSelectedIndicators(defaultSelectedIndicators);
    }, [keywordsUrlParams]);

    const handleSelectedIndicator = (values) => {
        if (values?.length) {
            const queryParams = creatUrlQueryParam('keywords', values?.join(','));
            router.replace(`${pathname}?${queryParams}`);
        } else {
            const queryParams = removeUrlQueryParam('keywords');
            router.replace(`${pathname}?${queryParams}`);
        }
    };

    if (isIndicatorsLoading) {
        return <VitalityLoader />;
    }

    if (!indicatorsList?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <Checkbox.Group
            value={selectedIndicators}
            options={indicatorsList}
            onChange={(values) => handleSelectedIndicator(values)}
        />
    );
};

export default VitalitySelectableIndicators;
