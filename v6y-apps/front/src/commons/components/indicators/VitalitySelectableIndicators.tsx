import { KeywordType } from '@v6y/core-logic/src/types';
import {
    Card,
    Checkbox,
    CheckboxOptionType,
    EmptyView,
    LoaderView,
    useNavigationAdapter,
} from '@v6y/shared-ui';
import * as React from 'react';
import { useEffect, useState } from 'react';

import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityApiConfig from '../../config/VitalityApiConfig';
import GetIndicatorListByParams from './getIndicatorListByParams';

interface VitalitySelectableIndicatorsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsKeywordsByParams: KeywordType[] };
}

const VitalitySelectableIndicators = () => {
    const [selectedIndicators, setSelectedIndicators] = useState<string[]>();
    const [indicatorsList, setIndicatorsList] = useState<KeywordType[]>();

    const { router, pathname, getUrlParams, createUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [keywordsUrlParams] = getUrlParams(['keywords']);

    const {
        isLoading: isIndicatorsLoading,
        data: dataIndicators,
    }: VitalitySelectableIndicatorsQueryType = useClientQuery({
        queryCacheKey: ['getIndicatorListByParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetIndicatorListByParams,
                variables: {
                    _id: null,
                },
            }),
    });

    useEffect(() => {
        const dataSource = dataIndicators?.getApplicationDetailsKeywordsByParams?.map(
            (item: KeywordType) => item.label,
        );

        const data = [...new Set(dataSource || [])].map((item) => ({
            label: item,
            value: item,
        }));

        setIndicatorsList(data);
    }, [dataIndicators?.getApplicationDetailsKeywordsByParams]);

    useEffect(() => {
        const defaultSelectedIndicators = keywordsUrlParams?.split(',');
        setSelectedIndicators(defaultSelectedIndicators);
    }, [keywordsUrlParams]);

    const handleSelectedIndicator = (values: string[]) => {
        if (values?.length) {
            const queryParams = createUrlQueryParam('keywords', values?.join(','));
            router.replace(`${pathname}?${queryParams}`);
        } else {
            const queryParams = removeUrlQueryParam('keywords');
            router.replace(`${pathname}?${queryParams}`);
        }
    };

    if (isIndicatorsLoading) {
        return <LoaderView />;
    }

    if (!indicatorsList?.length) {
        return <EmptyView />;
    }

    return (
        <Card bordered>
            <Checkbox.Group
                value={selectedIndicators}
                options={indicatorsList as CheckboxOptionType[]}
                onChange={(values) => handleSelectedIndicator(values)}
            />
        </Card>
    );
};

export default VitalitySelectableIndicators;
