import {
    Breadcrumb,
    BreadcrumbItemType,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import { buildBreadCrumbItems } from '../../config/VitalityCommonConfig';

const VitalityBreadcrumb = () => {
    const { pathname, urlParams, getUrlParams } = useNavigationAdapter();
    const [source] = getUrlParams(['source']);

    const { translate } = useTranslationProvider();

    return (
        <Breadcrumb
            items={
                buildBreadCrumbItems({
                    currentPage: pathname,
                    lastPage: source || '',
                    urlParams,
                    translate,
                }).filter((item) => item) as BreadcrumbItemType[]
            }
        />
    );
};

export default VitalityBreadcrumb;
