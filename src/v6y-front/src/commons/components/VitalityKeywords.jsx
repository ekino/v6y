import { Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';

import GetKeywordsByParams from '../../features/app-list/api/getKeywordsByParams.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import VitalityApiConfig from '../config/VitalityApiConfig.js';
import VitalityEmptyView from './VitalityEmptyView.jsx';
import VitalityLoader from './VitalityLoader.jsx';

const VitalityKeywords = () => {
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywordsList, setKeywordsList] = useState([]);

    const { router, pathname, getUrlParams, creatUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [keywordsUrlParams] = getUrlParams(['keywords']);

    const { isLoading: isKeywordsLoading, data: dataKeywords } = useClientQuery({
        queryCacheKey: ['getKeywords'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetKeywordsByParams,
                queryParams: {},
            }),
    });

    useEffect(() => {
        const data = dataKeywords?.getKeywordsByParams?.map((item) => ({
            ...item,
            value: item.label,
        }));

        setKeywordsList(data);
    }, [dataKeywords?.getKeywordsByParams]);

    useEffect(() => {
        const defaultSelectedKeywords = keywordsUrlParams?.split(',');
        setSelectedKeywords(defaultSelectedKeywords);
    }, [keywordsUrlParams]);

    const handleSelectedKeyword = (values) => {
        if (values?.length) {
            const queryParams = creatUrlQueryParam('keywords', values?.join(','));
            router.replace(`${pathname}?${queryParams}`);
        } else {
            const queryParams = removeUrlQueryParam('keywords');
            router.replace(`${pathname}?${queryParams}`);
        }
    };

    if (isKeywordsLoading) {
        return <VitalityLoader />;
    }

    if (!keywordsList?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <Checkbox.Group
            value={selectedKeywords}
            options={keywordsList}
            onChange={(values) => handleSelectedKeyword(values)}
        />
    );
};

export default VitalityKeywords;
