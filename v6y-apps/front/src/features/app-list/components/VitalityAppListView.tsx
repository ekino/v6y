'use client';

import { useEffect, useState } from 'react';

import { DynamicLoader } from '@v6y/ui-kit';
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    TypographyH3,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

const VitalityAppList = DynamicLoader(() => import('./VitalityAppList'));

const AVAILABLE_TECHNOLOGIES = [
    { slug: 'react', name: 'React' },
    { slug: 'typescript', name: 'TypeScript' },
    { slug: 'nodejs', name: 'Node.js' },
    { slug: 'python', name: 'Python' },
    { slug: 'docker', name: 'Docker' },
    { slug: 'kubernetes', name: 'Kubernetes' },
    { slug: 'graphql', name: 'GraphQL' },
    { slug: 'rest-api', name: 'REST API' },
    { slug: 'mongodb', name: 'MongoDB' },
    { slug: 'postgresql', name: 'PostgreSQL' },
    { slug: 'redis', name: 'Redis' },
    { slug: 'aws', name: 'AWS' },
    { slug: 'azure', name: 'Azure' },
    { slug: 'jest', name: 'Jest' },
    { slug: 'vitest', name: 'Vitest' },
    { slug: 'eslint', name: 'ESLint' },
    { slug: 'prettier', name: 'Prettier' },
    { slug: 'webpack', name: 'Webpack' },
    { slug: 'vite', name: 'Vite' },
    { slug: 'nextjs', name: 'Next.js' },
    { slug: 'vuejs', name: 'Vue.js' },
    { slug: 'angular', name: 'Angular' },
    { slug: 'express', name: 'Express' },
    { slug: 'nestjs', name: 'NestJS' },
    { slug: 'prisma', name: 'Prisma' },
];

const VitalityAppListView = () => {
    const { translate } = useTranslationProvider();
    const { getUrlParams, createUrlQueryParam, removeUrlQueryParam, router, pathname } =
        useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    useEffect(() => {
        if (keywords) {
            const keywordsFromUrl = keywords.split(',').filter(Boolean);
            setSelectedKeywords(keywordsFromUrl);
        }
    }, [keywords]);

    const handleKeywordToggle = (keyword: string, checked: boolean) => {
        const newSelectedKeywords = checked
            ? [...selectedKeywords, keyword]
            : selectedKeywords.filter((k) => k !== keyword);

        setSelectedKeywords(newSelectedKeywords);

        if (newSelectedKeywords.length > 0) {
            const queryParams = createUrlQueryParam('keywords', newSelectedKeywords.join(','));
            router.replace(`${pathname}?${queryParams}`, { scroll: false });
        } else {
            const queryParams = removeUrlQueryParam('keywords');
            router.replace(`${pathname}?${queryParams}`, { scroll: false });
        }
    };

    return (
        <div className="space-y-8 mt-4">
            <Card className="border-gray-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-md">
                        {translate('vitality.dashboardPage.filters.technologies') ||
                            'Available Technologies'}
                    </CardTitle>
                    <CardDescription>
                        Select technologies to filter applications and discover matching projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {AVAILABLE_TECHNOLOGIES.map(({ slug, name }) => (
                            <div
                                key={slug}
                                className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                                <Checkbox
                                    id={slug}
                                    checked={selectedKeywords.includes(slug)}
                                    onCheckedChange={(checked) =>
                                        handleKeywordToggle(slug, checked as boolean)
                                    }
                                />
                                <label
                                    htmlFor={slug}
                                    className="text-sm font-medium cursor-pointer select-none flex-1"
                                >
                                    {name}
                                </label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedKeywords.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <TypographyH3 className="text-md">
                            {translate('vitality.appListPage.activeFiltersLabel') ||
                                'Active Filters'}
                        </TypographyH3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {selectedKeywords.length} selected
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedKeywords.map((keyword) => (
                            <Badge
                                key={keyword}
                                variant="default"
                                className="cursor-pointer hover:bg-gray-200"
                                onClick={() => handleKeywordToggle(keyword, false)}
                            >
                                {keyword} ×
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <VitalityAppList />
        </div>
    );
};

export default VitalityAppListView;
