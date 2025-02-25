import { Breadcrumb, BreadcrumbItemType, useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';

import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    return (
        <Breadcrumb
            items={
                buildBreadCrumbItems({
                    currentPage: pathname,
                    lastPage: source || '',
                    urlParams,
                }).filter((item) => item) as BreadcrumbItemType[]
            }
        />
    );
};

export default VitalityBreadcrumb;
