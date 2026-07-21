'use client';

import { useEffect, useState } from 'react';

import { DynamicLoader } from '@v6y/ui-kit';
import {
    Badge,
    Button,
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

    const clearAllFilters = () => {
        setSelectedKeywords([]);
        router.replace(pathname, { scroll: false });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-2 px-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                        Filter the portfolio like a repository index, not a form.
                    </h1>
                </div>

                {selectedKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                            {selectedKeywords.length} active
                        </span>
                        <Button
                            variant="outline"
                            className="h-9 rounded-full border-slate-300 px-4 text-sm"
                            onClick={clearAllFilters}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>

            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-slate-950 md:text-lg">
                        {translate('vitality.dashboardPage.filters.technologies') ||
                            'Available Technologies'}
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                        Toggle the stacks you want to monitor. Filters stay lightweight, readable,
                        and easy to clear.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-5">
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TECHNOLOGIES.map(({ slug, name }) => {
                            const isSelected = selectedKeywords.includes(slug);

                            return (
                                <label
                                    key={slug}
                                    htmlFor={slug}
                                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                                        isSelected
                                            ? 'border-slate-900 bg-slate-900 text-white'
                                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    <Checkbox
                                        id={slug}
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                            handleKeywordToggle(slug, checked as boolean)
                                        }
                                    />
                                    <span>{name}</span>
                                </label>
                            );
                        })}
                    </div>

                    {selectedKeywords.length > 0 && (
                        <div className="space-y-3 rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                            <div className="flex items-center gap-2">
                                <TypographyH3 className="text-sm font-semibold text-slate-900">
                                    {translate('vitality.appListPage.activeFiltersLabel') ||
                                        'Active Filters'}
                                </TypographyH3>
                                <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                                    {selectedKeywords.length} selected
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedKeywords.map((keyword) => (
                                    <Badge
                                        key={keyword}
                                        variant="default"
                                        className="cursor-pointer rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-700"
                                        onClick={() => handleKeywordToggle(keyword, false)}
                                    >
                                        {keyword} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <VitalityAppList />
        </div>
    );
};

export default VitalityAppListView;
