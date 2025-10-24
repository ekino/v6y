import {
    useNavigationAdapter,
    useTranslationProvider,
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@v6y/ui-kit-front';
import * as React from 'react';

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
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <BreadcrumbItem key={idx}>
                            {!isLast ? (
                                <BreadcrumbLink className="text-black" asChild>{item.title}</BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            )}
                            {!isLast && <BreadcrumbSeparator />}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default VitalityBreadcrumb;
