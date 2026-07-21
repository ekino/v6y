import Link from 'next/link';
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

import {
    type BreadCrumbDisplayItem,
    buildBreadCrumbItems,
} from '../../config/VitalityCommonConfig';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    const { translate } = useTranslationProvider();

    const items = buildBreadCrumbItems({
        currentPage: pathname,
        lastPage: source || '',
        urlParams,
        translate,
    }).filter((item) => item) as BreadCrumbDisplayItem[];

    if (!items || items.length === 0) return null;

    return (
        <nav className="overflow-x-auto" aria-label="Breadcrumb">
            <Breadcrumb>
                <BreadcrumbList className="whitespace-nowrap px-0 py-1 text-xs text-slate-500 md:text-sm">
                    {items.map((item, idx) => {
                        const isLast = idx === items.length - 1;
                        return (
                            <React.Fragment key={idx}>
                                <BreadcrumbItem className="min-w-fit">
                                    {!isLast ? (
                                        <BreadcrumbLink
                                            className="text-slate-500 hover:text-slate-900 text-xs md:text-sm"
                                            asChild
                                        >
                                            <Link href={item.href || '#'}>{item.title}</Link>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="text-xs md:text-sm font-medium text-slate-900">
                                            {item.title}
                                        </BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator className="mx-1 text-slate-400 md:mx-2" />}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
};

export default VitalityBreadcrumb;
