import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    const { translate } = useTranslationProvider();

    const items = buildBreadCrumbItems({
        currentPage: pathname,
        lastPage: source || '',
        urlParams,
        translate,
    }).filter((item) => item) as { title: React.ReactNode }[];

    if (!items || items.length === 0) return null;

    return (
        <nav className="py-2 md:py-3 px-0 overflow-x-auto" aria-label="Breadcrumb">
            <Breadcrumb>
                <BreadcrumbList className="text-xs md:text-sm whitespace-nowrap">
                    {items.map((item, idx) => {
                        const isLast = idx === items.length - 1;
                        return (
                            <React.Fragment key={idx}>
                                <BreadcrumbItem className="min-w-fit">
                                    {!isLast ? (
                                        <BreadcrumbLink
                                            className="text-black hover:text-slate-700 text-xs md:text-sm"
                                            asChild
                                        >
                                            {item.title}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="text-xs md:text-sm font-medium text-slate-600">
                                            {item.title}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator className="mx-1 md:mx-2" />}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
};

export default VitalityBreadcrumb;
