import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@v6y/ui-kit-front/components/atoms/breadcrumb';
import useNavigationAdapter from '@v6y/ui-kit-front/hooks/useNavigationAdapter';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';

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
                        <React.Fragment key={idx}>
                            <BreadcrumbItem>
                                {!isLast ? (
                                    <BreadcrumbLink className="text-black" asChild>
                                        {item.title}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default VitalityBreadcrumb;
