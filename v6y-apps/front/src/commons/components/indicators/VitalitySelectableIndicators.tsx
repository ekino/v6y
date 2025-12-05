import { KeywordType } from '@v6y/core-logic/src/types';
import {
    Card,
    Checkbox,
    TypographyP,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit-front';
import * as React from 'react';
import { useEffect, useState } from 'react';

import {
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';

interface CheckboxOptionType {
    label: string;
    value: string;
}

interface VitalitySelectableIndicatorsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsKeywordsByParams: KeywordType[] };
}

const VitalitySelectableIndicators = () => {
    const [selectedIndicators, setSelectedIndicators] = useState<string[]>();
    const [indicatorsList, setIndicatorsList] = useState<CheckboxOptionType[]>();
    const { router, pathname, getUrlParams, createUrlQueryParam, removeUrlQueryParam } =
        useNavigationAdapter();
    const [keywordsUrlParams] = getUrlParams(['keywords']);
    const { translate } = useTranslationProvider();
    const {
        data: dataIndicators,
    } = useClientQuery<VitalitySelectableIndicatorsQueryType['data']>({
        queryCacheKey: ['getIndicatorListByParams'],
        queryBuilder: async () =>
            // Temporary fake data - comment out for real data
            Promise.resolve({
                getApplicationDetailsKeywordsByParams: [
                    {
                        _id: 1,
                        appId: 1,
                        label: 'performance',
                        module: {
                            appId: 1,
                            branch: 'main',
                            path: '/src/performance',
                            url: 'https://github.com/example/repo',
                            status: 'active'
                        },
                        status: 'active'
                    },
                    {
                        _id: 2,
                        appId: 1,
                        label: 'security',
                        module: {
                            appId: 1,
                            branch: 'main',
                            path: '/src/security',
                            url: 'https://github.com/example/repo',
                            status: 'active'
                        },
                        status: 'active'
                    },
                    {
                        _id: 3,
                        appId: 1,
                        label: 'accessibility',
                        module: {
                            appId: 1,
                            branch: 'main',
                            path: '/src/accessibility',
                            url: 'https://github.com/example/repo',
                            status: 'active'
                        },
                        status: 'active'
                    },
                    {
                        _id: 4,
                        appId: 1,
                        label: 'compliance',
                        module: {
                            appId: 1,
                            branch: 'main',
                            path: '/src/compliance',
                            url: 'https://github.com/example/repo',
                            status: 'active'
                        },
                        status: 'active'
                    },
                    {
                        _id: 5,
                        appId: 1,
                        label: 'maintainability',
                        module: {
                            appId: 1,
                            branch: 'main',
                            path: '/src/maintainability',
                            url: 'https://github.com/example/repo',
                            status: 'active'
                        },
                        status: 'active'
                    }
                ]
            })
            // Real query - uncomment when ready and restore imports
            /*buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetIndicatorListByParams,
                variables: {
                    _id: null,
                },
            })
            */
    });

    useEffect(() => {
        const dataSource = dataIndicators?.getApplicationDetailsKeywordsByParams
            ?.map((item: KeywordType) => item.label)
            ?.filter((label): label is string => Boolean(label));

        const data = [...new Set(dataSource || [])].map((item) => ({
            label: item,
            value: item,
        }));

        setIndicatorsList(data);
        
        // Set all indicators as selected by default if no URL params exist
        if (data.length > 0 && !keywordsUrlParams?.length) {
            const allValues = data.map(item => item.value);
            const queryParams = createUrlQueryParam('keywords', allValues.join(','));
            router.replace(`${pathname}?${queryParams}`);
        }
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

    const handleCheckboxChange = (value: string, checked: boolean) => {
        const newSelectedIndicators = checked
            ? [...(selectedIndicators || []), value]
            : (selectedIndicators || []).filter(item => item !== value);
        
        handleSelectedIndicator(newSelectedIndicators);
    };

    if (!indicatorsList?.length) {
        return (
            <Card className="border-gray-200">
                <div className="flex justify-center items-center p-2">
                    <TypographyP className="text-muted-foreground">
                        No indicators available
                    </TypographyP>
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 p-2">
            <div className="flex items-center justify-between">
                <p>{translate('vitality.appStatsPage.indicatorsTitle')}</p>
                {indicatorsList.map((option: CheckboxOptionType) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                            id={option.value}
                            checked={selectedIndicators?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                                handleCheckboxChange(option.value, checked as boolean)
                            }
                        />
                        <label
                            htmlFor={option.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            {translate(`vitality.appStatsPage.indicators.${option.label}`)}
                        </label>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default VitalitySelectableIndicators;
